import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc, RpcException } from '@nestjs/microservices';
import { AsyncLocalStorage } from 'node:async_hooks';
import { firstValueFrom } from 'rxjs';
import { RpcStatus } from '@cogna-edu/corn';
import { SuccessResponse } from '@cogna-edu/contracts/gen/content/common';
import {
  AnswerOption,
  CreateQuizRequest,
  CreateQuizResponse,
  DeleteQuizRequest,
  FindAllQuizzesBySubjectIdRequest,
  FindAllQuizzesBySubjectIdResponse,
  GenerateQuizRequest,
  GenerateQuizResponse,
  GetQuizRequest,
  PatchQuizRequest,
  Quiz,
  QuizResponse,
} from '@cogna-edu/contracts/gen/content/quiz';
import {
  GenerateQuizRequest as AiGenerateQuizRequest,
  QuizGenerationServiceClient,
} from '@cogna-edu/contracts/gen/internal/ai/quiz_generation';
import {
  AnswerOptionInput,
  QuestionType as ProtoQuestionType,
} from '@cogna-edu/contracts/dist/shared/quiz';
import { QuestionType as PrismaQuestionType } from '../../../prisma/generated/client';
import { PrismaService } from '../../infra/prisma/prisma.service';

type QuizWithOptions = {
  id: string;
  subjectId: string;
  ticketId: string;
  type: PrismaQuestionType;
  question: string;
  referenceAnswer: string | null;
  createdAt: Date;
  updatedAt: Date;
  answerOptions: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
};

@Injectable()
export class QuizService {
  private quizGenerationClient: QuizGenerationServiceClient;

  constructor(
    @Inject('QUIZ_GENERATION_CLIENT') private readonly client: ClientGrpc,
    @Inject('ALS') private readonly als: AsyncLocalStorage<{ userId: string }>,
    private readonly prisma: PrismaService,
  ) {
    this.quizGenerationClient = client.getService<QuizGenerationServiceClient>(
      'QuizGenerationService',
    );
  }

  public async createQuiz(dto: CreateQuizRequest): Promise<CreateQuizResponse> {
    const userId = this.requireUserId();
    const ticket = await this.findOwnedTicket(
      dto.subjectId,
      dto.ticketId,
      userId,
    );

    if (!ticket) {
      throw new RpcException({
        code: RpcStatus.NOT_FOUND,
        message: 'ticket not found or access denied',
      });
    }

    const type = this.toPrismaQuestionType(dto.type);
    this.validateQuizPayload(
      type,
      dto.question,
      dto.referenceAnswer,
      dto.answerOptions,
    );

    const created = await this.prisma.quiz.create({
      data: {
        subjectId: dto.subjectId,
        ticketId: dto.ticketId,
        type,
        question: dto.question,
        referenceAnswer: dto.referenceAnswer,
        answerOptions:
          type === PrismaQuestionType.OPEN
            ? undefined
            : {
                create: dto.answerOptions.map((option) => ({
                  text: option.text,
                  isCorrect: option.isCorrect,
                })),
              },
      },
      include: { answerOptions: true },
    });

    return { quiz: this.toQuiz(created) };
  }

  public async generateQuiz(
    dto: GenerateQuizRequest,
  ): Promise<GenerateQuizResponse> {
    const userId = this.requireUserId();
    const ticket = await this.findOwnedTicket(
      dto.subjectId,
      dto.ticketId,
      userId,
    );

    if (!ticket) {
      throw new RpcException({
        code: RpcStatus.NOT_FOUND,
        message: 'ticket not found or access denied',
      });
    }

    const type = this.toPrismaQuestionType(dto.type);
    const count = dto.count && dto.count > 0 ? dto.count : 1;
    const quizzes: Quiz[] = [];

    for (let i = 0; i < count; i++) {
      const generated = await firstValueFrom(
        this.quizGenerationClient.generateQuiz({
          ticketQuestion: ticket.question,
          ticketAnswer: ticket.answer,
          type: dto.type,
        } satisfies AiGenerateQuizRequest),
      );

      this.validateGeneratedQuiz(type, generated);

      const created = await this.prisma.quiz.create({
        data: {
          subjectId: dto.subjectId,
          ticketId: dto.ticketId,
          type,
          question: generated.question,
          referenceAnswer: generated.referenceAnswer,
          answerOptions:
            type === PrismaQuestionType.OPEN
              ? undefined
              : {
                  create: generated.answerOptions.map((option) => ({
                    text: option.text,
                    isCorrect: option.isCorrect,
                  })),
                },
        },
        include: { answerOptions: true },
      });

      quizzes.push(this.toQuiz(created));
    }

    return { quizzes };
  }

  public async getQuiz(dto: GetQuizRequest): Promise<QuizResponse> {
    const userId = this.requireUserId();
    const quiz = await this.findOwnedQuiz(dto.id, userId);

    if (!quiz) {
      throw new RpcException({
        code: RpcStatus.NOT_FOUND,
        message: 'quiz not found or access denied',
      });
    }

    return { quiz: this.toQuiz(quiz) };
  }

  public async patchQuiz(dto: PatchQuizRequest): Promise<QuizResponse> {
    const userId = this.requireUserId();
    const existing = await this.findOwnedQuiz(dto.id, userId);

    if (!existing) {
      throw new RpcException({
        code: RpcStatus.NOT_FOUND,
        message: 'quiz not found or access denied',
      });
    }

    const { id, question, referenceAnswer, answerOptions } = dto;

    if (answerOptions?.items) {
      this.validateAnswerOptions(existing.type, answerOptions.items);
    }

    if (
      existing.type === PrismaQuestionType.OPEN &&
      referenceAnswer !== undefined &&
      !referenceAnswer.trim()
    ) {
      throw new RpcException({
        code: RpcStatus.INVALID_ARGUMENT,
        message: 'reference answer is required for open question type',
      });
    }

    try {
      const quiz = await this.prisma.$transaction(async (tx) => {
        await tx.quiz.update({
          where: {
            id,
            subject: { userId },
          },
          data: {
            ...(question !== undefined ? { question } : {}),
            ...(referenceAnswer !== undefined ? { referenceAnswer } : {}),
          },
        });

        if (answerOptions?.items) {
          const toUpdate = answerOptions.items.filter(
            (option): option is AnswerOptionInput & { id: string } =>
              !!option.id,
          );
          const toCreate = answerOptions.items.filter((option) => !option.id);

          for (const option of toUpdate) {
            await tx.answerOption.update({
              where: { id: option.id },
              data: {
                text: option.text,
                isCorrect: option.isCorrect,
              },
            });
          }

          for (const option of toCreate) {
            await tx.answerOption.create({
              data: {
                quizId: id,
                text: option.text,
                isCorrect: option.isCorrect,
              },
            });
          }
        }

        return tx.quiz.findUnique({
          where: { id },
          include: { answerOptions: true },
        });
      });

      if (!quiz) {
        throw new RpcException({
          code: RpcStatus.NOT_FOUND,
          message: 'quiz not found or access denied',
        });
      }

      return { quiz: this.toQuiz(quiz) };
    } catch (error) {
      if (error instanceof RpcException) {
        throw error;
      }

      throw new RpcException({
        code: RpcStatus.NOT_FOUND,
        message: 'quiz not found or access denied',
      });
    }
  }

  public async deleteQuiz(dto: DeleteQuizRequest): Promise<SuccessResponse> {
    const userId = this.requireUserId();
    const result = await this.prisma.quiz.deleteMany({
      where: {
        id: dto.id,
        subject: { userId },
      },
    });

    if (result.count === 0) {
      throw new RpcException({
        code: RpcStatus.NOT_FOUND,
        message: 'quiz not found or access denied',
      });
    }

    return { ok: true };
  }

  public async findAllQuizzesBySubjectId(
    dto: FindAllQuizzesBySubjectIdRequest,
  ): Promise<FindAllQuizzesBySubjectIdResponse> {
    const userId = this.requireUserId();

    const subject = await this.prisma.subject.findFirst({
      where: {
        id: dto.subjectId,
        userId,
      },
      select: { id: true },
    });

    if (!subject) {
      throw new RpcException({
        code: RpcStatus.NOT_FOUND,
        message: 'subject not found or access denied',
      });
    }

    if (dto.ticketId) {
      const ticket = await this.prisma.ticket.findFirst({
        where: {
          id: dto.ticketId,
          subjectId: dto.subjectId,
        },
        select: { id: true },
      });

      if (!ticket) {
        throw new RpcException({
          code: RpcStatus.INVALID_ARGUMENT,
          message: 'ticket does not belong to the subject',
        });
      }
    }

    const where = {
      subjectId: dto.subjectId,
      ...(dto.ticketId ? { ticketId: dto.ticketId } : {}),
    };

    const [quizzes, totalCount] = await Promise.all([
      this.prisma.quiz.findMany({
        where,
        include: { answerOptions: true },
        orderBy: { createdAt: 'asc' },
      }),
      this.prisma.quiz.count({ where }),
    ]);

    return {
      quizzes: quizzes.map((quiz) => this.toQuiz(quiz)),
      totalCount,
    };
  }

  private requireUserId(): string {
    const userId = this.als.getStore()?.userId;
    if (!userId) {
      throw new RpcException({
        code: RpcStatus.UNAUTHENTICATED,
        message: 'missing user-id metadata',
      });
    }
    return userId;
  }

  private findOwnedTicket(subjectId: string, ticketId: string, userId: string) {
    return this.prisma.ticket.findFirst({
      where: {
        id: ticketId,
        subjectId,
        subject: { userId },
      },
    });
  }

  private findOwnedQuiz(id: string, userId: string) {
    return this.prisma.quiz.findFirst({
      where: {
        id,
        subject: { userId },
      },
      include: { answerOptions: true },
    });
  }

  private toPrismaQuestionType(type: ProtoQuestionType): PrismaQuestionType {
    switch (type) {
      case ProtoQuestionType.OPEN:
        return PrismaQuestionType.OPEN;
      case ProtoQuestionType.SINGLE_CHOICE:
        return PrismaQuestionType.SINGLE_CHOICE;
      case ProtoQuestionType.MULTIPLE_CHOICE:
        return PrismaQuestionType.MULTIPLE_CHOICE;
      default:
        throw new RpcException({
          code: RpcStatus.INVALID_ARGUMENT,
          message: 'invalid question type',
        });
    }
  }

  private toProtoQuestionType(type: PrismaQuestionType): ProtoQuestionType {
    switch (type) {
      case PrismaQuestionType.OPEN:
        return ProtoQuestionType.OPEN;
      case PrismaQuestionType.SINGLE_CHOICE:
        return ProtoQuestionType.SINGLE_CHOICE;
      case PrismaQuestionType.MULTIPLE_CHOICE:
        return ProtoQuestionType.MULTIPLE_CHOICE;
      default:
        return ProtoQuestionType.UNRECOGNIZED;
    }
  }

  private validateQuizPayload(
    type: PrismaQuestionType,
    question: string,
    referenceAnswer: string | undefined,
    answerOptions: AnswerOptionInput[],
  ) {
    if (!question.trim()) {
      throw new RpcException({
        code: RpcStatus.INVALID_ARGUMENT,
        message: 'question is required',
      });
    }

    if (type === PrismaQuestionType.OPEN) {
      if (!referenceAnswer?.trim()) {
        throw new RpcException({
          code: RpcStatus.INVALID_ARGUMENT,
          message: 'reference answer is required for open question type',
        });
      }
      if (answerOptions.length > 0) {
        throw new RpcException({
          code: RpcStatus.INVALID_ARGUMENT,
          message: 'open question type must not have answer options',
        });
      }
      return;
    }

    this.validateAnswerOptions(type, answerOptions);
  }

  private validateAnswerOptions(
    type: PrismaQuestionType,
    answerOptions: AnswerOptionInput[],
  ) {
    if (type === PrismaQuestionType.OPEN) {
      if (answerOptions.length > 0) {
        throw new RpcException({
          code: RpcStatus.INVALID_ARGUMENT,
          message: 'open question type must not have answer options',
        });
      }
      return;
    }

    const correctCount = answerOptions.filter(
      (option) => option.isCorrect,
    ).length;

    if (answerOptions.length < 2) {
      throw new RpcException({
        code: RpcStatus.INVALID_ARGUMENT,
        message: 'at least two answer options are required',
      });
    }

    if (type === PrismaQuestionType.SINGLE_CHOICE && correctCount !== 1) {
      throw new RpcException({
        code: RpcStatus.INVALID_ARGUMENT,
        message: 'single choice question must have exactly one correct option',
      });
    }

    if (type === PrismaQuestionType.MULTIPLE_CHOICE && correctCount < 2) {
      throw new RpcException({
        code: RpcStatus.INVALID_ARGUMENT,
        message:
          'multiple choice question must have at least two correct options',
      });
    }
  }

  private validateGeneratedQuiz(
    type: PrismaQuestionType,
    generated: {
      question: string;
      referenceAnswer?: string;
      answerOptions: AnswerOptionInput[];
    },
  ) {
    if (!generated.question.trim()) {
      throw new RpcException({
        code: RpcStatus.INTERNAL,
        message: 'quiz generation returned empty question',
      });
    }

    this.validateQuizPayload(
      type,
      generated.question,
      generated.referenceAnswer,
      generated.answerOptions,
    );
  }

  private toQuiz(quiz: QuizWithOptions): Quiz {
    return {
      id: quiz.id,
      subjectId: quiz.subjectId,
      ticketId: quiz.ticketId,
      type: this.toProtoQuestionType(quiz.type),
      question: quiz.question,
      referenceAnswer: quiz.referenceAnswer ?? undefined,
      answerOptions: quiz.answerOptions.map(
        (option): AnswerOption => ({
          id: option.id,
          text: option.text,
          isCorrect: option.isCorrect,
        }),
      ),
      createdAt: quiz.createdAt,
      updatedAt: quiz.updatedAt,
    };
  }
}

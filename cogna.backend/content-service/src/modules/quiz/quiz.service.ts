import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc, RpcException } from '@nestjs/microservices';
import { AsyncLocalStorage } from 'node:async_hooks';
import { firstValueFrom } from 'rxjs';
import { RpcStatus } from '@cogna-edu/corn';
import { SuccessResponse } from '@cogna-edu/contracts/gen/content/common';
import {
  AnswerOption,
  AnswerOptionInput,
  CreateQuizRequest,
  CreateQuizResponse,
  DeleteQuizRequest,
  FindAllQuizzesByTicketIdRequest,
  FindAllQuizzesByTicketIdResponse,
  GetQuizRequest,
  PatchQuizRequest,
  Quiz,
  QuizResponse,
} from '@cogna-edu/contracts/gen/content/quiz';
import {
  GenerateQuizRequest,
  QuizGenerationServiceClient,
} from '@cogna-edu/contracts/gen/internal/ai/quiz_generation';
import { PrismaService } from '../../infra/prisma/prisma.service';

type QuizWithOptions = {
  id: string;
  thesisId: string;
  ticketId: string;
  question: string;
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
    const ticket = await this.prisma.ticket.findFirst({
      where: {
        id: dto.ticketId,
        subject: { userId },
      },
      include: { theses: true },
    });

    if (!ticket) {
      throw new RpcException({
        code: RpcStatus.NOT_FOUND,
        message: 'ticket not found or access denied',
      });
    }

    const thesisIds =
      dto.thesisIds.length > 0
        ? dto.thesisIds
        : ticket.theses.map((thesis) => thesis.id);

    const theses = ticket.theses.filter((thesis) =>
      thesisIds.includes(thesis.id),
    );

    if (theses.length !== thesisIds.length) {
      throw new RpcException({
        code: RpcStatus.INVALID_ARGUMENT,
        message: 'some thesis ids do not belong to the ticket',
      });
    }

    const quizzes: Quiz[] = [];

    for (const thesis of theses) {
      const existing = await this.prisma.quiz.findUnique({
        where: { thesisId: thesis.id },
      });

      if (existing) {
        throw new RpcException({
          code: RpcStatus.ALREADY_EXISTS,
          message: `quiz already exists for thesis ${thesis.id}`,
        });
      }

      const generated = await firstValueFrom(
        this.quizGenerationClient.generateQuiz({
          thesisValue: thesis.value,
          ticketQuestion: ticket.question,
        } satisfies GenerateQuizRequest),
      );

      if ((generated.answerOptions?.length ?? 0) !== 4) {
        throw new RpcException({
          code: RpcStatus.INTERNAL,
          message: 'quiz generation returned invalid answer options count',
        });
      }

      const created = await this.prisma.quiz.create({
        data: {
          thesisId: thesis.id,
          ticketId: ticket.id,
          question: generated.question,
          answerOptions: {
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
    const { id, question, answerOptions } = dto;

    try {
      const quiz = await this.prisma.$transaction(async (tx) => {
        await tx.quiz.update({
          where: {
            id,
            ticket: { subject: { userId } },
          },
          data: {
            ...(question !== undefined ? { question } : {}),
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
        ticket: { subject: { userId } },
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

  public async findAllQuizzesByTicketId(
    dto: FindAllQuizzesByTicketIdRequest,
  ): Promise<FindAllQuizzesByTicketIdResponse> {
    const userId = this.requireUserId();

    const ticket = await this.prisma.ticket.findFirst({
      where: {
        id: dto.ticketId,
        subject: { userId },
      },
      select: { id: true },
    });

    if (!ticket) {
      throw new RpcException({
        code: RpcStatus.NOT_FOUND,
        message: 'ticket not found or access denied',
      });
    }

    const [quizzes, totalCount] = await Promise.all([
      this.prisma.quiz.findMany({
        where: { ticketId: dto.ticketId },
        include: { answerOptions: true },
        orderBy: { createdAt: 'asc' },
      }),
      this.prisma.quiz.count({ where: { ticketId: dto.ticketId } }),
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

  private findOwnedQuiz(id: string, userId: string) {
    return this.prisma.quiz.findFirst({
      where: {
        id,
        ticket: { subject: { userId } },
      },
      include: { answerOptions: true },
    });
  }

  private toQuiz(quiz: QuizWithOptions): Quiz {
    return {
      id: quiz.id,
      thesisId: quiz.thesisId,
      ticketId: quiz.ticketId,
      question: quiz.question,
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

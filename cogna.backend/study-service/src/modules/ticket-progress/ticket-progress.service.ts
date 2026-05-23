import { Injectable, Logger } from '@nestjs/common';
import { TicketProgressRepository } from './ticket-progress.repository';
import {
  BatchTicketProgressBySubjectsRequest,
  FindAllTicketsProgressRequest,
  FindAllTicketsProgressResponse,
  FindDueTicketsProgressRequest,
  FindDueTicketsProgressResponse,
  FindOneTicketProgressRequest,
  FindOneTicketProgressResponse,
  TicketProgress as TicketProgressGrpc,
} from '@cogna-edu/contracts/gen/study/ticket-progress';
import { RpcException } from '@nestjs/microservices';
import {
  State as PrismaState,
  TicketProgress as TicketProgressPrisma,
} from '../../../prisma/generated/client';
import { LogExecutionTime } from '@cogna-edu/corn';
import { PrismaService } from '../../infra/prisma/prisma.service';
import { Card } from 'ts-fsrs';

/** Событие: новая оценка по билету (например из Kafka ticket-attempt). */
export type TicketProgressAfterAttemptInput = {
  ticketId: string;
  userId: string;
  subjectId: string;
  score: number;
  card: Card;
};

@Injectable()
export class TicketProgressService {
  private logger: Logger;

  constructor(
    private readonly ticketProgressRepository: TicketProgressRepository,
  ) {
    this.logger = new Logger('TicketProgressService');
  }

  @LogExecutionTime()
  public async findOne(
    dto: FindOneTicketProgressRequest,
  ): Promise<FindOneTicketProgressResponse> {
    const ticketProgress = await this.ticketProgressRepository.findOne(
      dto.userId,
      dto.ticketId,
    );
    if (!ticketProgress) throw new RpcException({});

    return {
      ticketProgress: this.mapPrismaToGrpc(ticketProgress),
    };
  }

  @LogExecutionTime()
  public async findAll(
    dto: FindAllTicketsProgressRequest,
  ): Promise<FindAllTicketsProgressResponse> {
    const tickets = await this.ticketProgressRepository.findAll(
      dto.userId,
      dto.subjectId,
    );

    return {
      ticketsProgress: tickets.map((t) => {
        return this.mapPrismaToGrpc(t);
      }),
    };
  }

  @LogExecutionTime()
  public async batchTicketsBySubjects(
    dto: BatchTicketProgressBySubjectsRequest,
  ): Promise<FindAllTicketsProgressResponse> {
    const tickets = await this.ticketProgressRepository.batchBySubjects(
      dto.userId,
      dto.subjectIds,
    );

    return {
      ticketsProgress: tickets.map((t) => {
        return this.mapPrismaToGrpc(t);
      }),
    };
  }

  public async findDueTicketsProgress(
    dto: FindDueTicketsProgressRequest,
  ): Promise<FindDueTicketsProgressResponse> {
    const tickets = await this.ticketProgressRepository.findDueTicketsProgress({
      ...dto,
    });

    return {
      ticketProgress: tickets.map((t) => this.mapPrismaToGrpc(t)),
    };
  }

  /**
   * Пересчёт агрегатов прогресса по билету после оценки попытки
   * (gRPC-методы выше сюда не заходят).
   */
  public async upsertWithNewScore(
    dto: TicketProgressAfterAttemptInput,
    tx?: Pick<PrismaService, 'ticketProgress'>,
  ): Promise<{ progress: TicketProgressPrisma; newlyStudied: boolean }> {
    const existing =
      await this.ticketProgressRepository.findByUserIdAndTicketId(
        dto.userId,
        dto.ticketId,
        tx,
      );

    const newTotalCount = existing ? existing.totalCount + 1 : 1;
    const newAverageScore = existing
      ? (existing.averageScore * existing.totalCount + dto.score) /
        newTotalCount
      : dto.score;
    const newBestScore = existing
      ? Math.max(existing.bestScore, dto.score)
      : dto.score;
    const wasStudied = (existing?.bestScore ?? 0) >= 6;
    const isNowStudied = newBestScore >= 5;
    const newlyStudied = !wasStudied && isNowStudied;

    const progress =
      await this.ticketProgressRepository.upsertAfterAttemptScore(
        {
          userId: dto.userId,
          ticketId: dto.ticketId,
          subjectId: dto.subjectId,
          attemptScore: dto.score,
          newTotalCount,
          newBestScore,
          newAverageScore,
          card: dto.card,
        },
        tx,
      );

    return { progress, newlyStudied };
  }

  private mapPrismaToGrpc(
    ticketProgress: TicketProgressPrisma,
  ): TicketProgressGrpc {
    return {
      id: ticketProgress.id,
      ticketId: ticketProgress.ticketId,
      userId: ticketProgress.userId,
      subjectId: ticketProgress.subjectId,
      totalCount: ticketProgress.totalCount,
      bestScore: ticketProgress.bestScore,
      lastScore: ticketProgress.lastScore,
      averageScore: ticketProgress.averageScore,
      due: ticketProgress.due,
      stability: ticketProgress.stability,
      difficulty: ticketProgress.difficulty,
      elapsedDays: ticketProgress.elapsedDays,
      scheduleDays: ticketProgress.scheduleDays,
      learningSteps: ticketProgress.learningSteps,
      reps: ticketProgress.reps,
      lapses: ticketProgress.lapses,
      state: this.prismaStateToNumber[ticketProgress.state],
      lastReview: ticketProgress.lastReview,
      createdAt: ticketProgress.createdAt,
      updatedAt: ticketProgress.updatedAt,
    };
  }

  protected prismaStateToNumber: Record<PrismaState, number> = {
    [PrismaState.NEW]: 0,
    [PrismaState.LEARNING]: 1,
    [PrismaState.REVIEW]: 2,
    [PrismaState.RELEANING]: 3,
  };
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infra/prisma/prisma.service';
import {
  State as PrismaState,
  TicketProgress,
} from '../../../prisma/generated/client';
import { Card, State as FsrsState } from 'ts-fsrs';

/** Агрегаты для upsert после оценки попытки; всё кроме subjectId в create нужно в update. */
export type UpsertAfterAttemptData = {
  userId: string;
  ticketId: string;
  subjectId: string;
  attemptScore: number;
  newTotalCount: number;
  newBestScore: number;
  newAverageScore: number;
  card: Card;
};

const CARD_STATE_TO_PRISMA: Record<FsrsState, PrismaState> = {
  [FsrsState.New]: PrismaState.NEW,
  [FsrsState.Learning]: PrismaState.LEARNING,
  [FsrsState.Review]: PrismaState.REVIEW,
  [FsrsState.Relearning]: PrismaState.RELEANING,
};

@Injectable()
export class TicketProgressRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public async findByUserIdAndTicketId(
    userId: string,
    ticketId: string,
    tx?: Pick<PrismaService, 'ticketProgress'>,
  ) {
    const client = tx ?? this.prismaService;
    return client.ticketProgress.findUnique({
      where: { userId_ticketId: { userId, ticketId } },
    });
  }

  public async findOne(userId: string, ticketId: string) {
    return this.findByUserIdAndTicketId(userId, ticketId);
  }

  public async findAll(userId: string, subjectId: string) {
    return this.prismaService.ticketProgress.findMany({
      where: { userId, subjectId },
    });
  }

  public async batchBySubjects(userId: string, subjectIds: string[]) {
    return this.prismaService.ticketProgress.findMany({
      where: { userId, subjectId: { in: subjectIds } },
    });
  }

  public async findDueTicketsProgress(dto: {
    userId: string;
    subjectId: string;
    ticketId: string;
    limit?: number;
    offset?: number;
  }) {
    return this.prismaService.ticketProgress.findMany({
      where: {
        userId: dto.userId,
        subjectId: dto.subjectId,
        due: { lte: new Date() },
        ticketId: dto.ticketId,
      },
      orderBy: { due: 'asc' },
      take: dto.limit,
      skip: dto.offset,
    });
  }

  public async upsertAfterAttemptScore(
    data: UpsertAfterAttemptData,
    tx?: Pick<PrismaService, 'ticketProgress'>,
  ): Promise<TicketProgress> {
    const client = tx ?? this.prismaService;
    return client.ticketProgress.upsert({
      where: {
        userId_ticketId: { userId: data.userId, ticketId: data.ticketId },
      },
      create: {
        ticketId: data.ticketId,
        userId: data.userId,
        subjectId: data.subjectId,
        totalCount: 1,
        bestScore: data.attemptScore,
        lastScore: data.attemptScore,
        averageScore: data.attemptScore,
        due: data.card.due,
        stability: data.card.stability,
        difficulty: data.card.difficulty,
        scheduleDays: data.card.scheduled_days,
        learningSteps: data.card.learning_steps,
        reps: data.card.reps,
        lapses: data.card.lapses,
        state: CARD_STATE_TO_PRISMA[data.card.state],
        lastReview: data.card.last_review as Date,
      },
      update: {
        totalCount: data.newTotalCount,
        bestScore: data.newBestScore,
        lastScore: data.attemptScore,
        averageScore: data.newAverageScore,
        due: data.card.due,
        stability: data.card.stability,
        difficulty: data.card.difficulty,
        scheduleDays: data.card.scheduled_days,
        learningSteps: data.card.learning_steps,
        reps: data.card.reps,
        lapses: data.card.lapses,
        state: CARD_STATE_TO_PRISMA[data.card.state],
        lastReview: data.card.last_review,
      },
    });
  }
}

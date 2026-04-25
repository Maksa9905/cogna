import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infra/prisma/prisma.service';
import { TicketProgress } from '../../../prisma/generated/client';

/** Агрегаты для upsert после оценки попытки; всё кроме subjectId в create нужно в update. */
export type UpsertAfterAttemptData = {
  userId: string;
  ticketId: string;
  subjectId: string;
  attemptScore: number;
  newTotalCount: number;
  newBestScore: number;
  newAverageScore: number;
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
      },
      update: {
        totalCount: data.newTotalCount,
        bestScore: data.newBestScore,
        lastScore: data.attemptScore,
        averageScore: data.newAverageScore,
      },
    });
  }
}

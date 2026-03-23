import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infra/prisma/prisma.service';

export type TicketProgressUpsertRequest = {
  ticketId: string;
  userId: string;
  subjectId: string;
  score: number;
};

@Injectable()
export class TicketProgressRepository {
  constructor(private readonly prismaService: PrismaService) {}


  public async upsertWithNewScore(
    dto: TicketProgressUpsertRequest,
    tx?: Pick<PrismaService, 'ticketProgress'>,
  ) {
    const client = tx ?? this.prismaService;
    const where = {
      userId_ticketId: { userId: dto.userId, ticketId: dto.ticketId },
    };

    const existing = await client.ticketProgress.findUnique({ where });

    const newTotalCount = existing ? existing.totalCount + 1 : 1;
    const newAverageScore = existing
      ? (existing.averageScore * existing.totalCount + dto.score) /
        newTotalCount
      : dto.score;
    const newBestScore = existing
      ? Math.max(existing.bestScore, dto.score)
      : dto.score;
    const wasStudied = (existing?.bestScore ?? 0) >= 5;
    const isNowStudied = newBestScore >= 5;
    const newlyStudied = !wasStudied && isNowStudied;

    const progress = await client.ticketProgress.upsert({
      where,
      create: {
        ticketId: dto.ticketId,
        userId: dto.userId,
        subjectId: dto.subjectId,
        totalCount: 1,
        bestScore: dto.score,
        lastScore: dto.score,
        averageScore: dto.score,
      },
      update: {
        totalCount: newTotalCount,
        bestScore: newBestScore,
        lastScore: dto.score,
        averageScore: newAverageScore,
      },
    });

    return { progress, newlyStudied };
  }
}

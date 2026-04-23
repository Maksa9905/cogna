import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infra/prisma/prisma.service';

export type SubjectProgressUpsertOnAttemptRequest = {
  userId: string;
  subjectId: string;
  newlyStudiedTicket: boolean;
};

@Injectable()
export class SubjectProgressRepository {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Updates SubjectProgress when a ticket attempt is made.
   * Computes average from TicketProgress (AVG of ticket averages) and stores it.
   * Pass tx when called inside transaction so aggregate sees updated TicketProgress.
   */
  public async upsertOnTicketAttempt(
    dto: SubjectProgressUpsertOnAttemptRequest,
    tx?: Pick<PrismaService, 'subjectProgress' | 'ticketProgress'>,
  ) {
    const client = tx ?? this.prismaService;
    const where = {
      userId_subjectId: { userId: dto.userId, subjectId: dto.subjectId },
    };

    const averageTicketsScore = await this.getAverageTicketsScore(
      dto.userId,
      dto.subjectId,
      client,
    );

    const existing = await client.subjectProgress.findUnique({ where });

    const studiedIncrement = dto.newlyStudiedTicket ? 1 : 0;
    const newStudiedTickets = existing
      ? existing.studiedTickets + studiedIncrement
      : studiedIncrement;

    return client.subjectProgress.upsert({
      where,
      create: {
        userId: dto.userId,
        subjectId: dto.subjectId,
        studiedTickets: studiedIncrement,
        averageTicketsScore,
        lastRepetitionDate: new Date(),
      },
      update: {
        studiedTickets: newStudiedTickets,
        averageTicketsScore,
        lastRepetitionDate: new Date(),
      },
    });
  }

  /**
   * Средняя оценка предмета = AVG(averageScore) по TicketProgress.
   * Сумма средних по билетам / кол-во билетов.
   */
  public async getAverageTicketsScore(
    userId: string,
    subjectId: string,
    client?: Pick<PrismaService, 'ticketProgress'>,
  ): Promise<number> {
    const prisma = client ?? this.prismaService;
    const result = await prisma.ticketProgress.aggregate({
      where: { userId, subjectId },
      _avg: { averageScore: true },
    });
    return result._avg.averageScore ?? 0;
  }

  public async findOne(userId: string, subjectId: string) {
    return this.prismaService.subjectProgress.findUnique({
      where: { userId_subjectId: { userId, subjectId } },
    });
  }

  public async findAll(userId: string) {
    return this.prismaService.subjectProgress.findMany({
      where: { userId: userId },
    });
  }
}

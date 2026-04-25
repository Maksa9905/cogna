import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infra/prisma/prisma.service';
import { TicketAttemptRequest } from '@cogna-edu/contracts/gen/study/ticket-attempt';
import { SubjectProgressRepository } from '../subject-progress/subject-progress.repository';
import { TicketProgressService } from '../ticket-progress/ticket-progress.service';

@Injectable()
export class TicketAttemptRepository {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly ticketProgressService: TicketProgressService,
    private readonly subjectProgressRepository: SubjectProgressRepository,
  ) {}

  public async createTicketAttemptWithProgress(dto: TicketAttemptRequest) {
    return this.prismaService.$transaction(async (tx) => {
      await this.subjectProgressRepository.ensureExists(
        dto.userId,
        dto.subjectId,
        tx,
      );

      const { progress, newlyStudied } =
        await this.ticketProgressService.upsertWithNewScore(
          {
            ticketId: dto.ticketId,
            userId: dto.userId,
            subjectId: dto.subjectId,
            score: dto.score,
          },
          tx,
        );

      const attempt = await tx.ticketAttempt.create({
        data: {
          ticketProgressId: progress.id,
          score: dto.score,
          summary: dto.summary,
          theses: dto.theses.map(({ thesis, assessment }) => ({
            thesis,
            assessment,
          })),
        },
      });

      await this.subjectProgressRepository.upsertOnTicketAttempt(
        {
          userId: dto.userId,
          subjectId: dto.subjectId,
          newlyStudiedTicket: newlyStudied,
        },
        tx,
      );

      return attempt;
    });
  }

  public async batchByTicketProgress(data: {
    userId: string;
    ticketId: string;
  }) {
    return this.prismaService.ticketAttempt.findMany({
      where: {
        ticketProgress: {
          userId: data.userId,
          ticketId: data.ticketId,
        },
      },
    });
  }
}

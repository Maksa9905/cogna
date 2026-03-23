import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infra/prisma/prisma.service';
import { TicketAttemptRequest } from '@cogna-edu/contracts/gen/study/ticket';
import { SubjectProgressRepository } from '../subject-progress/subject-progress.repository';
import { TicketProgressRepository } from './ticket-progress.repository';

@Injectable()
export class TicketAttemptRepository {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly ticketProgressRepository: TicketProgressRepository,
    private readonly subjectProgressRepository: SubjectProgressRepository,
  ) {}

  public async createTicketAttemptWithProgress(dto: TicketAttemptRequest) {
    return this.prismaService.$transaction(async (tx) => {
      const attempt = await tx.ticketAttempt.create({
        data: {
          ticketId: dto.ticketId,
          userId: dto.userId,
          subjectId: dto.subjectId,
          score: dto.score,
          summary: dto.summary,
          theses: dto.theses.map(({ thesis, assessment }) => ({
            thesis,
            assessment,
          })),
        },
      });

      const { newlyStudied } =
        await this.ticketProgressRepository.upsertWithNewScore(
          {
            ticketId: dto.ticketId,
            userId: dto.userId,
            subjectId: dto.subjectId,
            score: dto.score,
          },
          tx,
        );

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
}

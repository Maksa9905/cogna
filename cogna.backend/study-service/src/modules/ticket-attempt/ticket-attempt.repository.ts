import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infra/prisma/prisma.service';
import { TicketAttemptEvent } from '@cogna-edu/contracts/gen/events/study/ticket_attempt';
import { SubjectProgressRepository } from '../subject-progress/subject-progress.repository';
import { TicketProgressService } from '../ticket-progress/ticket-progress.service';
import {
  RecordLogItem,
  Rating as FsrsRating,
  State as FsrsState,
} from 'ts-fsrs';
import {
  Rating as PrismaRating,
  State as PrismaState,
} from '../../../prisma/generated/client';

const LOG_RATING_TO_PRISMA: Record<FsrsRating, PrismaRating> = {
  [FsrsRating.Manual]: PrismaRating.MANUAL,
  [FsrsRating.Again]: PrismaRating.AGAIN,
  [FsrsRating.Hard]: PrismaRating.HARD,
  [FsrsRating.Good]: PrismaRating.GOOD,
  [FsrsRating.Easy]: PrismaRating.EASY,
};

const LOG_STATE_TO_PRISMA: Record<FsrsState, PrismaState> = {
  [FsrsState.New]: PrismaState.NEW,
  [FsrsState.Learning]: PrismaState.LEARNING,
  [FsrsState.Review]: PrismaState.REVIEW,
  [FsrsState.Relearning]: PrismaState.RELEANING,
};

@Injectable()
export class TicketAttemptRepository {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly ticketProgressService: TicketProgressService,
    private readonly subjectProgressRepository: SubjectProgressRepository,
  ) {}

  public async createTicketAttemptWithProgress(data: {
    dto: TicketAttemptEvent;
    record: RecordLogItem;
  }) {
    const { dto, record } = data;
    const { card, log } = record;
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
            card: card,
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
          rating: LOG_RATING_TO_PRISMA[log.rating],
          state: LOG_STATE_TO_PRISMA[log.state],
          due: log.due,
          stability: log.stability,
          difficulty: log.difficulty,
          scheduledDays: log.scheduled_days,
          learningSteps: log.learning_steps,
          review: log.review,
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

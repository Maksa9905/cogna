import { Injectable } from '@nestjs/common';
import {
  BatchTicketAttemptsRequest,
  FindAllTicketsAttemptsResponse,
  ThesisAssessment,
  TicketAttempt as TicketAttemptGrpc,
  TicketAttemptRequest,
} from '@cogna-edu/contracts/gen/study/ticket-attempt';
import { LogExecutionTime } from '@cogna-edu/corn';
import {
  Rating as PrismaRating,
  State as PrismaState,
  TicketAttempt as TicketAttemptPrisma,
  TicketProgress,
} from '../../../prisma/generated/client';
import { TicketAttemptRepository } from './ticket-attempt.repository';
import {
  Card,
  createEmptyCard,
  fsrs,
  Grade,
  Rating,
  State as FsrsState,
} from 'ts-fsrs';
import { TicketProgressRepository } from '../ticket-progress/ticket-progress.repository';

@Injectable()
export class TicketAttemptService {
  constructor(
    private readonly ticketAttemptRepository: TicketAttemptRepository,
    private readonly ticketProgressRepository: TicketProgressRepository,
  ) {}

  @LogExecutionTime()
  public async handleTicketAttempt(dto: TicketAttemptRequest) {
    const progress = await this.ticketProgressRepository.findOne(
      dto.userId,
      dto.ticketId,
    );
    const card: Card = progress
      ? this.mapTicketProgressToCard(progress)
      : createEmptyCard();
    const record = fsrs().next(
      card,
      new Date(),
      this.scoreToFsrsGrade(dto.score),
    );
    const ticketAttempt =
      await this.ticketAttemptRepository.createTicketAttemptWithProgress({
        dto: dto,
        record: record,
      });
    console.log(ticketAttempt);
    return dto;
  }

  @LogExecutionTime()
  public async batchByTicketProgressIds(
    dto: BatchTicketAttemptsRequest,
  ): Promise<FindAllTicketsAttemptsResponse> {
    const rows = await this.ticketAttemptRepository.batchByTicketProgress({
      userId: dto.userId,
      ticketId: dto.ticketProgressIds,
    });

    return {
      ticketsAttempts: rows.map((row) => this.mapPrismaToGrpc(row)),
    };
  }

  private mapPrismaToGrpc(attempt: TicketAttemptPrisma): TicketAttemptGrpc {
    return {
      id: attempt.id,
      ticketProgressId: attempt.ticketProgressId,
      rating: this.prismaRatingToNumber[attempt.rating],
      state: this.prismaStateToNumber[attempt.state],
      due: attempt.due,
      score: attempt.score,
      summary: attempt.summary ?? '',
      theses: (attempt.theses ?? []) as unknown as ThesisAssessment[],
      createdAt: attempt.createdAt,
      updatedAt: attempt.updatedAt,
      stability: attempt.stability,
      difficulty: attempt.difficulty,
      elapsedDays: attempt.elapsedDays,
      lastElapsedDays: attempt.lastElapsedDays,
      scheduledDays: attempt.scheduledDays,
      learningSteps: attempt.learningSteps,
      review: attempt.review,
    };
  }

  private mapTicketProgressToCard(progress: TicketProgress): Card {
    return {
      due: progress.due,
      stability: progress.stability,
      difficulty: progress.difficulty,
      elapsed_days: progress.elapsedDays,
      scheduled_days: progress.scheduleDays,
      learning_steps: progress.learningSteps,
      reps: progress.reps,
      lapses: progress.lapses,
      state: this.prismaStateToNumber[progress.state],
      last_review: progress.lastReview,
    };
  }

  protected prismaStateToNumber: Record<PrismaState, number> = {
    [PrismaState.NEW]: 0,
    [PrismaState.LEARNING]: 1,
    [PrismaState.REVIEW]: 2,
    [PrismaState.RELEANING]: 3,
  };

  protected prismaRatingToNumber: Record<PrismaRating, number> = {
    [PrismaRating.MANUAL]: 0,
    [PrismaRating.AGAIN]: 1,
    [PrismaRating.HARD]: 2,
    [PrismaRating.GOOD]: 3,
    [PrismaRating.EASY]: 4,
  };

  protected scoreToFsrsGrade(score: number): Grade {
    if (score >= 8.5) return Rating.Easy;
    if (score >= 6) return Rating.Good;
    if (score >= 4) return Rating.Again;
    return Rating.Hard;
  }
}

import { Injectable } from '@nestjs/common';
import {
  BatchTicketAttemptsRequest,
  FindAllTicketsAttemptsResponse,
  ThesisAssessment,
  TicketAttempt as TicketAttemptGrpc,
  TicketAttemptRequest,
} from '@cogna-edu/contracts/gen/study/ticket-attempt';
import { LogExecutionTime } from '@cogna-edu/corn';
import { TicketAttempt as TicketAttemptPrisma } from '../../../prisma/generated/client';
import { TicketAttemptRepository } from './ticket-attempt.repository';

@Injectable()
export class TicketAttemptService {
  constructor(
    private readonly ticketAttemptRepository: TicketAttemptRepository,
  ) {}

  @LogExecutionTime()
  public async handleTicketAttempt(dto: TicketAttemptRequest) {
    const ticketAttempt =
      await this.ticketAttemptRepository.createTicketAttemptWithProgress(dto);
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
      score: attempt.score,
      summary: attempt.summary ?? '',
      theses: (attempt.theses ?? []) as unknown as ThesisAssessment[],
      createdAt: attempt.createdAt,
      updatedAt: attempt.updatedAt,
    };
  }
}

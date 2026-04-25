import { Injectable } from '@nestjs/common';
import { TicketAttemptRequest } from '@cogna-edu/contracts/gen/study/ticket-attempt';
import { LogExecutionTime } from '@cogna-edu/corn';
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
}

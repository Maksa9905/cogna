import { Controller } from '@nestjs/common';
import { TicketAttemptService } from './ticket-attempt.service';
import { EventPattern } from '@nestjs/microservices';
import { TicketAttemptRequest } from '@cogna-edu/contracts/gen/study/ticket';

@Controller('ticket-attempt')
export class TicketAttemptController {
  constructor(private readonly ticketAttemptService: TicketAttemptService) {}

  @EventPattern('study.ticket-attempt')
  public assumeTicker(dto: TicketAttemptRequest) {
    return this.ticketAttemptService.handleTicketAttempt(dto);
  }
}

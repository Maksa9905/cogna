import { Controller } from '@nestjs/common';
import { TicketAttemptService } from './ticket-attempt.service';
import { EventPattern } from '@nestjs/microservices';
import { TicketAttemptRequest } from '@cogna-edu/contracts/gen/study/ticket-attempt';

@Controller('ticket-attempt')
export class TicketAttemptController {
  constructor(private readonly ticketAttemptService: TicketAttemptService) {}

  /** Kafka: payload с ticketId/userId/subjectId; попытка сохраняется с ссылкой на TicketProgress. */
  @EventPattern('study.ticket-attempt')
  public handleTicketAttemptEvent(dto: TicketAttemptRequest) {
    return this.ticketAttemptService.handleTicketAttempt(dto);
  }
}

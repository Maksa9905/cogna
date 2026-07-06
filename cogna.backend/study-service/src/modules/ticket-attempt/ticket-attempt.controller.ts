import { Controller } from '@nestjs/common';
import { TicketAttemptService } from './ticket-attempt.service';
import { EventPattern } from '@nestjs/microservices';
import {
  StudyTicketAttemptServiceController,
  BatchTicketAttemptsRequest,
  FindAllTicketsAttemptsResponse,
} from '@cogna-edu/contracts/gen/study/ticket-attempt';
import { TicketAttemptEvent } from '@cogna-edu/contracts/gen/events/study/ticket_attempt';
import { StudyTicketAttemptServiceControllerMethods } from '@cogna-edu/contracts/dist/study/ticket-attempt';
import { TicketProgressService } from '../ticket-progress/ticket-progress.service';

@StudyTicketAttemptServiceControllerMethods()
@Controller('ticket-attempt')
export class TicketAttemptController implements StudyTicketAttemptServiceController {
  constructor(private readonly ticketAttemptService: TicketAttemptService) {}

  /** Kafka: payload с ticketId/userId/subjectId; попытка сохраняется с ссылкой на TicketProgress. */
  @EventPattern('study.ticket-attempt')
  public handleTicketAttemptEvent(dto: TicketAttemptEvent) {
    return this.ticketAttemptService.handleTicketAttempt(dto);
  }

  batchTicketAttemptsByTicketProgress(
    request: BatchTicketAttemptsRequest,
  ): Promise<FindAllTicketsAttemptsResponse> {
    return this.ticketAttemptService.batchByTicketProgressIds(request);
  }
}

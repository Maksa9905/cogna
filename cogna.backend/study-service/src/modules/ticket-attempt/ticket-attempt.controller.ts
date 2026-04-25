import { Controller } from '@nestjs/common';
import { TicketAttemptService } from './ticket-attempt.service';
import { EventPattern } from '@nestjs/microservices';
import {
  TicketAttemptRequest,
  StudyTicketAttemptServiceController,
  BatchTicketAttemptsRequest,
  FindAllTicketsAttemptsResponse,
} from '@cogna-edu/contracts/gen/study/ticket-attempt';
import { StudyTicketAttemptServiceControllerMethods } from '@cogna-edu/contracts/dist/study/ticket-attempt';

@StudyTicketAttemptServiceControllerMethods()
@Controller('ticket-attempt')
export class TicketAttemptController implements StudyTicketAttemptServiceController {
  constructor(private readonly ticketAttemptService: TicketAttemptService) {}

  /** Kafka: payload с ticketId/userId/subjectId; попытка сохраняется с ссылкой на TicketProgress. */
  @EventPattern('study.ticket-attempt')
  public handleTicketAttemptEvent(dto: TicketAttemptRequest) {
    return this.ticketAttemptService.handleTicketAttempt(dto);
  }

  batchTicketAttemptsByTicketProgress(
    request: BatchTicketAttemptsRequest,
  ): Promise<FindAllTicketsAttemptsResponse> {
    return this.ticketAttemptService.batchByTicketProgressIds(request);
  }
}

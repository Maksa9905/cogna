import { Controller } from '@nestjs/common';
import { TicketProgressService } from './ticket-progress.service';
import {
  BatchTicketProgressBySubjectsRequest,
  FindAllTicketsProgressRequest,
  FindAllTicketsProgressResponse,
  FindDueTicketsProgressRequest,
  FindDueTicketsProgressResponse,
  FindOneTicketProgressRequest,
  FindOneTicketProgressResponse,
  StudyTicketProgressServiceController,
} from '@cogna-edu/contracts/gen/study/ticket-progress';
import { StudyTicketProgressServiceControllerMethods } from '@cogna-edu/contracts/dist/study/ticket-progress';

@Controller('ticket-progress')
@StudyTicketProgressServiceControllerMethods()
export class TicketProgressController implements StudyTicketProgressServiceController {
  constructor(private readonly ticketProgressService: TicketProgressService) {}

  findAllTicketProgress(
    request: FindAllTicketsProgressRequest,
  ): Promise<FindAllTicketsProgressResponse> {
    return this.ticketProgressService.findAll(request);
  }

  findOneTicketProgress(
    request: FindOneTicketProgressRequest,
  ): Promise<FindOneTicketProgressResponse> {
    return this.ticketProgressService.findOne(request);
  }

  batchTicketProgressBySubjects(
    request: BatchTicketProgressBySubjectsRequest,
  ): Promise<FindAllTicketsProgressResponse> {
    return this.ticketProgressService.batchTicketsBySubjects(request);
  }

  findDueTicketsProgress(
    request: FindDueTicketsProgressRequest,
  ): Promise<FindDueTicketsProgressResponse> {
    return this.ticketProgressService.findDueTicketsProgress(request);
  }
}

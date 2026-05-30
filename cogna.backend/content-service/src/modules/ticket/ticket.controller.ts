import { Controller } from '@nestjs/common';
import { TicketService } from './ticket.service';
import {
  CreateTicketRequest,
  DeleteTicketRequest,
  FindAllTicketsRequest,
  FindAllTicketsResponse,
  FindOneTicketRequest,
  GenerateAnswerRequest,
  GenerateAnswerResponse,
  GenerateThesesRequest,
  TicketResponse,
  TicketServiceControllerMethods,
  PatchTicketRequest,
  TicketServiceController
} from '@cogna-edu/contracts/dist/content/ticket';
import { SuccessResponse } from '@cogna-edu/contracts/gen/content/common';

@Controller('ticket')
@TicketServiceControllerMethods()
export class TicketController implements TicketServiceController {
  constructor(private readonly ticketService: TicketService) {}

  createTicket(request: CreateTicketRequest): Promise<TicketResponse> {
    return this.ticketService.createTicket(request);
  }

  deleteTicket(request: DeleteTicketRequest): Promise<SuccessResponse> {
    return this.ticketService.deleteTicket(request);
  }

  findAllTickets(
    request: FindAllTicketsRequest,
  ): Promise<FindAllTicketsResponse> {
    return this.ticketService.findAllTickets(request);
  }

  findOneTicket(request: FindOneTicketRequest): Promise<TicketResponse> {
    return this.ticketService.findOneTicket(request);
  }

  generateTheses(request: GenerateThesesRequest): Promise<TicketResponse> {
    return this.ticketService.generateThesis(request);
  }

  generateAnswer(request: GenerateAnswerRequest): Promise<GenerateAnswerResponse> {
    return this.ticketService.generateAnswer(request);
  }

  patchTicket(request: PatchTicketRequest): Promise<TicketResponse> {
    return this.ticketService.patchTicket(request);
  }
}

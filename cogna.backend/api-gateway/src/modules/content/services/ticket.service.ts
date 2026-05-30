import { Inject, Injectable } from '@nestjs/common';
import {
  CreateTicketRequest,
  DeleteTicketRequest,
  FindAllTicketsRequest,
  FindOneTicketRequest,
  GenerateAnswerRequest,
  GenerateAnswerResponse,
  GenerateThesesRequest,
  TicketServiceClient,
  PatchTicketRequest,
} from '@cogna-edu/contracts/dist/content/ticket';
import { firstValueFrom } from 'rxjs';
import { ClientGrpc } from '@nestjs/microservices';

@Injectable()
export class TicketService {
  private ticketClient: TicketServiceClient;

  constructor(@Inject('CONTENT_GRPC') private readonly client: ClientGrpc) {
    this.ticketClient = client.getService<TicketServiceClient>('TicketService');
  }

  public async createTicket(dto: CreateTicketRequest) {
    return await firstValueFrom(this.ticketClient.createTicket(dto));
  }

  public async findOneTicket(dto: FindOneTicketRequest) {
    return await firstValueFrom(this.ticketClient.findOneTicket(dto));
  }

  public async findAllTickets(dto: FindAllTicketsRequest) {
    return await firstValueFrom(this.ticketClient.findAllTickets(dto));
  }

  public async patchTicket(dto: PatchTicketRequest) {
    return await firstValueFrom(this.ticketClient.patchTicket(dto));
  }

  public async deleteTicket(dto: DeleteTicketRequest) {
    return await firstValueFrom(this.ticketClient.deleteTicket(dto));
  }

  public async generateTheses(dto: GenerateThesesRequest) {
    return await firstValueFrom(this.ticketClient.generateTheses(dto));
  }

  public async generateAnswer(dto: GenerateAnswerRequest): Promise<GenerateAnswerResponse> {
    return await firstValueFrom(this.ticketClient.generateAnswer(dto));
  }
}

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
import { ClientGrpc } from '@nestjs/microservices';
import { AsyncLocalStorage } from 'node:async_hooks';
import {
  createGrpcClientWithMetadata,
  UserContextStore,
  WithGrpcMetadata,
} from '../../../common/utils/grpc-with-metadata.util';

@Injectable()
export class TicketService {
  private readonly ticketClient: WithGrpcMetadata<TicketServiceClient>;

  constructor(
    @Inject('CONTENT_GRPC') client: ClientGrpc,
    @Inject('ALS') als: AsyncLocalStorage<UserContextStore>,
  ) {
    this.ticketClient = createGrpcClientWithMetadata(
      client.getService<TicketServiceClient>('TicketService'),
      als,
    );
  }

  public createTicket(dto: CreateTicketRequest) {
    return this.ticketClient.createTicket(dto);
  }

  public findOneTicket(dto: FindOneTicketRequest) {
    return this.ticketClient.findOneTicket(dto);
  }

  public findAllTickets(dto: FindAllTicketsRequest) {
    return this.ticketClient.findAllTickets(dto);
  }

  public patchTicket(dto: PatchTicketRequest) {
    return this.ticketClient.patchTicket(dto);
  }

  public deleteTicket(dto: DeleteTicketRequest) {
    return this.ticketClient.deleteTicket(dto);
  }

  public generateTheses(dto: GenerateThesesRequest) {
    return this.ticketClient.generateTheses(dto);
  }

  public generateAnswer(
    dto: GenerateAnswerRequest,
  ): Promise<GenerateAnswerResponse> {
    return this.ticketClient.generateAnswer(dto);
  }
}

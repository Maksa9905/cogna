import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc, RpcException } from '@nestjs/microservices';
import { TicketServiceClient } from '@cogna-edu/contracts/gen/content/ticket';
import { firstValueFrom } from 'rxjs';
import { ProcessTranscriptionRequest } from '@cogna-edu/contracts/gen/assessment/assessment';
import { GroqChatCompletionService } from '../groq-chat-completion/groq-chat-completion.service';

@Injectable()
export class AssessmentService {

  private contentTicketClient: TicketServiceClient;

  constructor(@Inject('CONTENT_GRPC_CLIENT') client: ClientGrpc, private readonly groqChat: GroqChatCompletionService) {
    this.contentTicketClient = client.getService<TicketServiceClient>('TicketService');
  }

  public async processTranscription(data: ProcessTranscriptionRequest) {
    const { answer, ticketId, userId } = data;
    const { ticket } = await firstValueFrom(this.contentTicketClient.findOneTicket({ id: ticketId, userId: userId }));
    if (!ticket) throw new RpcException({});
    console.log(ticket);
    const res = await this.groqChat.assume(answer, ticket.question, ticket.answer, ticket.theses);
    console.log(res);
  }
}

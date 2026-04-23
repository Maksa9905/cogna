import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc, ClientKafka, RpcException } from '@nestjs/microservices';
import { TicketServiceClient } from '@cogna-edu/contracts/gen/content/ticket';
import { firstValueFrom } from 'rxjs';
import { ProcessRequest } from '@cogna-edu/contracts/gen/assessment/assessment';
import { GroqChatCompletionService } from '../groq-chat-completion/groq-chat-completion.service';
import { TicketAttemptRequest } from '@cogna-edu/contracts/gen/study/ticket-attempt';

@Injectable()
export class AssessmentService {

  private contentTicketClient: TicketServiceClient;

  constructor(@Inject('CONTENT_GRPC_CLIENT') clientContent: ClientGrpc,
              @Inject('STUDY_KAFKA_CLIENT') private readonly studyKafkaClient: ClientKafka,
              @Inject('API_GATEWAY_KAFKA_CLIENT') private readonly apiGatewayKafkaClient: ClientKafka,
              private readonly groqChat: GroqChatCompletionService) {
    this.contentTicketClient = clientContent.getService<TicketServiceClient>('TicketService');
  }

  async onModuleInit() {
    await this.studyKafkaClient.connect();
    await this.apiGatewayKafkaClient.connect()
  }

  public async processTranscription(data: ProcessRequest) {
    const { answer, ticketId, userId } = data;
    const { ticket } = await firstValueFrom(this.contentTicketClient.findOneTicket({ id: ticketId, userId: userId }));
    if (!ticket) throw new RpcException({});
    // console.log(ticket);
    const res = await this.groqChat.assume(answer, ticket.question, ticket.answer, ticket.theses);
    console.log(res);
    const payload: TicketAttemptRequest = {
      ticketId,
      userId,
      subjectId: ticket.subjectId,
      score: res.score,
      summary: res.summary,
      theses: res.theses,
    };
    this.studyKafkaClient.emit('study.ticket-attempt', payload);
    this.apiGatewayKafkaClient.emit('assessment.completed', payload)
  }
}

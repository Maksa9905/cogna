import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc, RpcException } from '@nestjs/microservices';
import { TicketServiceClient } from '@cogna-edu/contracts/gen/content/ticket';
import { firstValueFrom } from 'rxjs';
import { ProcessRequest } from '@cogna-edu/contracts/gen/assessment/assessment';
import { TicketAttemptRequest } from '@cogna-edu/contracts/gen/study/ticket-attempt';
import { Thesis } from '@cogna-edu/contracts/gen/content/ticket';
import { GroqService } from '../../groq/groq.service';
import { StudyClient } from '../../kafka/clients/study.client';
import { ApiGatewayClient } from '../../kafka/clients/api-gateway.client';
import { RpcStatus } from '@cogna-edu/corn';

interface GroqAssumeResponse {
  theses: {
    thesis: string;
    assessment: string;
  }[];
  summary: string;
  score: number;
}

@Injectable()
export class AssessmentService {
  private contentTicketClient: TicketServiceClient;

  constructor(
    @Inject('CONTENT_GRPC_CLIENT') clientContent: ClientGrpc,
    private readonly groqService: GroqService,
    private readonly studyClient: StudyClient,
    private readonly apiGatewayClient: ApiGatewayClient,
  ) {
    this.contentTicketClient =
      clientContent.getService<TicketServiceClient>('TicketService');
  }

  public async processTranscription(data: ProcessRequest) {
    const { answer, ticketId, userId } = data;
    const { ticket } = await firstValueFrom(
      this.contentTicketClient.findOneTicket({ id: ticketId, userId }),
    );
    if (!ticket) {
      throw new RpcException({
        code: RpcStatus.NOT_FOUND,
        message: 'ticket not found',
      });
    }
    const res = await this.assume(
      answer,
      ticket.question,
      ticket.answer,
      ticket.theses,
    );
    console.log(res);
    const payload: TicketAttemptRequest = {
      ticketId,
      userId,
      subjectId: ticket.subjectId,
      score: res.score,
      summary: res.summary,
      theses: res.theses,
    };
    this.studyClient.emitTicketAttempt('study.ticket-attempt', payload);
    this.apiGatewayClient.emitAssessmentCompleted(payload);
  }

  private async assume(
    answer: string,
    question: string,
    referenceAnswer: string,
    thesis: Thesis[],
  ): Promise<GroqAssumeResponse> {
    const ths = thesis.map((t) => t.value);

    const systemPrompt =
      `Пользователь даёт ответ на вопрос: "${question}". ` +
      `Тебе нужно сравнить его ответ с тезисами: ${ths.join(', ')}. ` +
      `ТЫ ДОЛЖЕН ВЕРНУТЬ СТРОГО JSON, КОТОРЫЙ УДОВЛЕТВОРЯЕТ СХЕМЕ:\n` +
      `{\n` +
      `  "theses": [\n` +
      `    { "thesis": string, "assessment": "bad" | "satisfies" | "good" | "perfect" }\n` +
      `  ],\n` +
      `  "summary": string,\n` +
      `  "score": float от 1 до 10, с округлением до 1 знака после запятой\n` +
      `}\n` +
      `Все три поля (theses, summary, score) ОБЯЗАТЕЛЬНЫ. Никакого текста вне JSON.`;

    try {
      const response = await this.groqService.client.chat.completions.create({
        model: 'openai/gpt-oss-20b',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: answer },
        ],
        temperature: 0.2,
        max_completion_tokens: 1024,
        top_p: 1,
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'response',
            strict: true,
            schema: {
              type: 'object',
              properties: {
                theses: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      thesis: { type: 'string' },
                      assessment: {
                        type: 'string',
                        enum: ['bad', 'satisfies', 'good', 'perfect'],
                      },
                    },
                    required: ['thesis', 'assessment'],
                    additionalProperties: false,
                  },
                },
                summary: { type: 'string' },
                score: { type: 'number', minimum: 1, maximum: 10 },
              },
              required: ['theses', 'summary', 'score'],
              additionalProperties: false,
            },
          },
        },
      });
      console.log('end assume');
      const content = response.choices[0].message.content;
      if (!content) {
        throw new RpcException({
          code: RpcStatus.INTERNAL,
          message: 'empty assessment response from model',
        });
      }
      return JSON.parse(content) as GroqAssumeResponse;
    } catch (error: any) {
      console.error('Groq assume error:', {
        message: error?.message,
        status: error?.status,
        code: error?.error?.error?.code,
        validationMessage: error?.error?.error?.message,
        failedGeneration: error?.error?.error?.failed_generation,
      });
      throw new RpcException({
        code: RpcStatus.INTERNAL,
        message: 'assessment failed',
      });
    }
  }
}

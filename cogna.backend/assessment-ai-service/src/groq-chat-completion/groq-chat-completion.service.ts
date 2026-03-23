import { Injectable, UseFilters } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Groq } from 'groq-sdk';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { OpenAI } from 'openai';
import { Thesis } from '@cogna-edu/contracts/gen/content/ticket';
import { QuiteGroqErrorFilter } from '../common/filters/quite-groq-error.filter';
import { RpcException } from '@nestjs/microservices';



export interface GroqAssumeResponse {
  theses: {
    thesis: string
    assessment: string
  }[],
  summary: string
  score: number
}

@UseFilters(new QuiteGroqErrorFilter())
@Injectable()
export class GroqChatCompletionService {
  private groq: Groq;
  private agent: HttpsProxyAgent<string>;

  constructor(private readonly configService: ConfigService) {
    const proxyUrl = this.configService.getOrThrow<string>('PROXY_URL');
    this.agent = new HttpsProxyAgent(proxyUrl);
    this.groq = new Groq({
      apiKey: configService.getOrThrow<string>('GROQ_API_KEY'),
      httpAgent: this.agent,
      // fetch: (url, options) => fetch(url, { ...options, agent: this.agent } as any),
    });
  }

  public async assume(answer: string, question: string, referenceAnswer: string, thesis: Thesis[]) {
    console.log('start assume');
    const ths = thesis.map(t => t.value);

    const systemPrompt =
      `Пользователь даёт ответ на вопрос: "${question}". ` +
      `Тебе нужно сравнить его ответ с тезисами: ${ths.join(', ')}. ` +
      `ТЫ ДОЛЖЕН ВЕРНУТЬ СТРОГО JSON, КОТОРЫЙ УДОВЛЕТВОРЯЕТ СХЕМЕ:\n` +
      `{\n` +
      `  "theses": [\n` +
      `    { "thesis": string, "assessment": "отлично" | "хорошо" | "удовлетворительно" | "плохо" }\n` +
      `  ],\n` +
      `  "summary": string,\n` +
      `  "score": number от 1 до 10\n` +
      `}\n` +
      `Все три поля (theses, summary, score) ОБЯЗАТЕЛЬНЫ. Никакого текста вне JSON.`;

    const userPrompt = answer;

    try {
      const response = await this.groq.chat.completions.create({
        model: 'openai/gpt-oss-20b',
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: userPrompt,
          },
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
                        enum: ['отлично', 'хорошо', 'удовлетворительно', 'плохо'],
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
      console.log('res:', response);
      console.log('message:', response.choices[0].message);
      const content = response.choices[0].message.content
      if (!content) throw new RpcException({})
      return JSON.parse(content) as GroqAssumeResponse
    } catch (error: any) {
      console.error('Groq assume error:', {
        message: error?.message,
        status: error?.status,
        code: error?.error?.error?.code,
        validationMessage: error?.error?.error?.message,
        failedGeneration: error?.error?.error?.failed_generation,
      });
      throw new RpcException({});
    }
  }
}

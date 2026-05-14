import { Injectable } from '@nestjs/common';
import {
  GenerateThesesRequest,
  GenerateThesesResponse,
} from '@cogna-edu/contracts/gen/thesis/thesis';
import { HttpsProxyAgent } from 'https-proxy-agent';
import Groq from 'groq-sdk';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ThesisService {
  private agent: HttpsProxyAgent<string>;
  private groq: Groq;

  constructor(private readonly configService: ConfigService) {
    const proxyUrl = `${configService.getOrThrow<string>('PROXY_URL')}`;
    this.agent = new HttpsProxyAgent(proxyUrl);
    this.groq = new Groq({
      apiKey: this.configService.getOrThrow<string>('GROQ_API_KEY'),
      httpAgent: this.agent,
    });
  }

  public async generateThesis(
    dto: GenerateThesesRequest,
  ): Promise<GenerateThesesResponse> {
    const response = await this.groq.chat.completions.create({
      model: 'openai/gpt-oss-20b',
      messages: [
        {
          role: 'system',
          content: `Тебе надо написать тезисы по экзамиционному билету и эталонному твету на него,Отвечай строго на Русском, максимум 3-5 тезисов, пиши емко и только суть, максимум слов в тезисе 15`,
        },
        {
          role: 'user',
          content: `Вопрос: ${dto.question}\n\nОтвет: ${dto.answer}`,
        },
      ],
      max_completion_tokens: 2048,
      temperature: 1,
      n: 1,
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'thesis_schema',
          strict: true,
          schema: {
            type: 'object',
            properties: {
              theses: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    value: { type: 'string' },
                    importance: {
                      type: 'string',
                      enum: ['LOW', 'MEDIUM', 'HIGH'],
                    },
                  },
                  required: ['value', 'importance'],
                  additionalProperties: false,
                },
              },
            },
            required: ['theses'],
            additionalProperties: false,
          },
        },
      },
    });
    const content = response.choices[0].message.content ?? '';
    return JSON.parse(content) as GenerateThesesResponse;
  }
}

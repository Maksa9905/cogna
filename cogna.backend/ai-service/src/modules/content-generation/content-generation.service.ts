import { Injectable } from '@nestjs/common';
import {
  GenerateAnswerRequest,
  GenerateAnswerResponse,
  GenerateThesesRequest,
  GenerateThesesResponse,
} from '@cogna-edu/contracts/gen/thesis/thesis';
import { GroqService } from '../../groq/groq.service';

@Injectable()
export class ContentGenerationService {
  constructor(private readonly groqService: GroqService) {}

  public async generateThesis(
    dto: GenerateThesesRequest,
  ): Promise<GenerateThesesResponse> {
    const response = await this.groqService.client.chat.completions.create({
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

  public async generateAnswer(
    dto: GenerateAnswerRequest,
  ): Promise<GenerateAnswerResponse> {
    const response = await this.groqService.client.chat.completions.create({
      model: 'openai/gpt-oss-20b',
      messages: [
        {
          role: 'system',
          content:
            'Ты преподаватель высшего учебного заведения. Тебе задают экзаменационный вопрос — напиши на него развёрнутый, структурированный и точный ответ. Отвечай строго на русском языке. Пиши по существу, без воды, но достаточно подробно, чтобы ответ покрывал все ключевые аспекты вопроса.',
        },
        {
          role: 'user',
          content: `Вопрос: ${dto.question}`,
        },
      ],
      max_completion_tokens: 4096,
      temperature: 0.7,
      n: 1,
    });
    const answer = response.choices[0].message.content ?? '';
    return { answer };
  }
}

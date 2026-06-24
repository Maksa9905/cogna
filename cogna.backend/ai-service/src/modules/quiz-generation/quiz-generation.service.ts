import { Injectable } from '@nestjs/common';
import {
  GenerateQuizRequest,
  GenerateQuizResponse,
} from '@cogna-edu/contracts/gen/internal/ai/quiz_generation';
import { GroqService } from '../../groq/groq.service';

@Injectable()
export class QuizGenerationService {
  constructor(private readonly groqService: GroqService) {}

  public async generateQuiz(
    dto: GenerateQuizRequest,
  ): Promise<GenerateQuizResponse> {
    const response = await this.groqService.client.chat.completions.create({
      model: 'openai/gpt-oss-20b',
      messages: [
        {
          role: 'system',
          content:
            'Сгенерируй один вопрос с ровно 4 вариантами ответа по экзаменационному билету и ключевому тезису. Ровно один вариант должен быть правильным. Отвечай строго на русском языке.',
        },
        {
          role: 'user',
          content: `Вопрос билета: ${dto.ticketQuestion}\n\nТезис: ${dto.thesisValue}`,
        },
      ],
      max_completion_tokens: 2048,
      temperature: 0.8,
      n: 1,
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'quiz_schema',
          strict: true,
          schema: {
            type: 'object',
            properties: {
              question: { type: 'string' },
              answer_options: {
                type: 'array',
                minItems: 4,
                maxItems: 4,
                items: {
                  type: 'object',
                  properties: {
                    text: { type: 'string' },
                    is_correct: { type: 'boolean' },
                  },
                  required: ['text', 'is_correct'],
                  additionalProperties: false,
                },
              },
            },
            required: ['question', 'answer_options'],
            additionalProperties: false,
          },
        },
      },
    });

    const content = response.choices[0].message.content ?? '';
    const parsed = JSON.parse(content) as {
      question: string;
      answer_options: { text: string; is_correct: boolean }[];
    };

    return {
      question: parsed.question,
      answerOptions: parsed.answer_options.map((option) => ({
        text: option.text,
        isCorrect: option.is_correct,
      })),
    };
  }
}

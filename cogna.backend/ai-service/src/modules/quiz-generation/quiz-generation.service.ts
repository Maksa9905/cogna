import { Injectable } from '@nestjs/common';
import {
  GenerateQuizRequest,
  GenerateQuizResponse,
} from '@cogna-edu/contracts/gen/internal/ai/quiz_generation';
import {
  AnswerOptionInput,
  QuestionType,
} from '@cogna-edu/contracts/dist/shared/quiz';
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
          content: this.buildSystemPrompt(dto.type),
        },
        {
          role: 'user',
          content: `Вопрос билета: ${dto.ticketQuestion}\n\nЭталонный ответ: ${dto.ticketAnswer}`,
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
          schema: this.buildJsonSchema(dto.type),
        },
      },
    });

    const content = response.choices[0].message.content ?? '';
    const parsed = JSON.parse(content) as {
      question: string;
      reference_answer?: string;
      answer_options?: { text: string; is_correct: boolean }[];
    };

    return {
      question: parsed.question,
      referenceAnswer: parsed.reference_answer,
      answerOptions: (parsed.answer_options ?? []).map(
        (option): AnswerOptionInput => ({
          text: option.text,
          isCorrect: option.is_correct,
        }),
      ),
    };
  }

  private buildSystemPrompt(type: QuestionType): string {
    switch (type) {
      case QuestionType.OPEN:
        return (
          'Сгенерируй один вопрос с открытым ответом по экзаменационному билету. ' +
          'Также напиши эталонный ответ, с которым потом можно будет сравнить ответ студента. ' +
          'Отвечай строго на русском языке.'
        );
      case QuestionType.SINGLE_CHOICE:
        return (
          'Сгенерируй один вопрос с ровно 4 вариантами ответа по экзаменационному билету. ' +
          'Ровно один вариант должен быть правильным. Отвечай строго на русском языке.'
        );
      case QuestionType.MULTIPLE_CHOICE:
        return (
          'Сгенерируй один вопрос с ровно 4 вариантами ответа по экзаменационному билету. ' +
          'Минимум два варианта должны быть правильными. Отвечай строго на русском языке.'
        );
      default:
        return 'Сгенерируй quiz-вопрос по экзаменационному билету. Отвечай строго на русском языке.';
    }
  }

  private buildJsonSchema(type: QuestionType) {
    if (type === QuestionType.OPEN) {
      return {
        type: 'object',
        properties: {
          question: { type: 'string' },
          reference_answer: { type: 'string' },
        },
        required: ['question', 'reference_answer'],
        additionalProperties: false,
      };
    }

    const minCorrect = type === QuestionType.MULTIPLE_CHOICE ? 2 : 1;
    const maxCorrect = type === QuestionType.SINGLE_CHOICE ? 1 : 3;

    return {
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
      ...(type === QuestionType.SINGLE_CHOICE
        ? {}
        : {
            description: `Exactly 4 options, between ${minCorrect} and ${maxCorrect} must be correct`,
          }),
    };
  }
}

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Groq } from 'groq-sdk';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { OpenAI } from 'openai';
import { Thesis } from '@cogna-edu/contracts/gen/content/ticket';

@Injectable()
export class GroqChatCompletionService {
  private groq: Groq;
  private agent: HttpsProxyAgent<string>;

  constructor(private readonly configService: ConfigService) {
    const proxyUrl = this.configService.getOrThrow<string>('PROXY_URL');
    this.agent = new HttpsProxyAgent(proxyUrl);
    this.groq = new Groq({
      apiKey: configService.getOrThrow<string>('GROQ_API_KEY'),
      httpAgent: this.agent
      // fetch: (url, options) => fetch(url, { ...options, agent: this.agent } as any),
    });
  }

  public async assume(answer: string, question: string, referenceAnswer: string, thesis: Thesis[]) {
    console.log('start assume');
    const ths = thesis.map(t => t.value)
    // console.log(thesis);
    console.log(ths);
    const systemPrompt = `тебе надо сравнивать ответ пользователя на вопрос - ${question}.
          Сранить с эталоным ответом на этот вопрос ${referenceAnswer} и проверить на соответвие тезисам, обязательно укажи какие тезисы раскрыты а какие нет ${ths} и всоем ответе и рядом с ними оценку отлично, хорошо, удволитворительно, плохо. Вконце обязательно Поставь оценку от 1 до 10`
    const userPrompt = answer
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
      temperature: 1,
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
                    thesis: {type: 'string'},
                    assessment: {type: 'string', enum: ["отлично", "хорошо", "удволитворительно", "плохо"]}
                  }
                }
              },
              summary: {type: 'string'},
              score: {type: 'number'}
            },
          }
        }
      }
    });
    console.log('end resume');
    return response.choices[0].message.content;
  }
}

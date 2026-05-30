"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThesisService = void 0;
const common_1 = require("@nestjs/common");
const groq_service_1 = require("../../groq/groq.service");
let ThesisService = class ThesisService {
    groqService;
    constructor(groqService) {
        this.groqService = groqService;
    }
    async generateThesis(dto) {
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
        return JSON.parse(content);
    }
    async generateAnswer(dto) {
        const response = await this.groqService.client.chat.completions.create({
            model: 'openai/gpt-oss-20b',
            messages: [
                {
                    role: 'system',
                    content: 'Ты преподаватель высшего учебного заведения. Тебе задают экзаменационный вопрос — напиши на него развёрнутый, структурированный и точный ответ. Отвечай строго на русском языке. Пиши по существу, без воды, но достаточно подробно, чтобы ответ покрывал все ключевые аспекты вопроса.',
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
};
exports.ThesisService = ThesisService;
exports.ThesisService = ThesisService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [groq_service_1.GroqService])
], ThesisService);
//# sourceMappingURL=thesis.service.js.map
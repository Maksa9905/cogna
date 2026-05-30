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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssessmentService = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const rxjs_1 = require("rxjs");
const groq_service_1 = require("../../groq/groq.service");
const study_client_1 = require("../../kafka/clients/study.client");
const api_gateway_client_1 = require("../../kafka/clients/api-gateway.client");
let AssessmentService = class AssessmentService {
    groqService;
    studyClient;
    apiGatewayClient;
    contentTicketClient;
    constructor(clientContent, groqService, studyClient, apiGatewayClient) {
        this.groqService = groqService;
        this.studyClient = studyClient;
        this.apiGatewayClient = apiGatewayClient;
        this.contentTicketClient =
            clientContent.getService('TicketService');
    }
    async processTranscription(data) {
        const { answer, ticketId, userId } = data;
        const { ticket } = await (0, rxjs_1.firstValueFrom)(this.contentTicketClient.findOneTicket({ id: ticketId, userId }));
        if (!ticket)
            throw new microservices_1.RpcException({});
        const res = await this.assume(answer, ticket.question, ticket.answer, ticket.theses);
        console.log(res);
        const payload = {
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
    async assume(answer, question, referenceAnswer, thesis) {
        const ths = thesis.map((t) => t.value);
        const systemPrompt = `Пользователь даёт ответ на вопрос: "${question}". ` +
            `Тебе нужно сравнить его ответ с тезисами: ${ths.join(', ')}. ` +
            `ТЫ ДОЛЖЕН ВЕРНУТЬ СТРОГО JSON, КОТОРЫЙ УДОВЛЕТВОРЯЕТ СХЕМЕ:\n` +
            `{\n` +
            `  "theses": [\n` +
            `    { "thesis": string, "assessment": "отлично" | "хорошо" | "удовлетворительно" | "плохо" }\n` +
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
                                                enum: [
                                                    'отлично',
                                                    'хорошо',
                                                    'удовлетворительно',
                                                    'плохо',
                                                ],
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
            if (!content)
                throw new microservices_1.RpcException({});
            return JSON.parse(content);
        }
        catch (error) {
            console.error('Groq assume error:', {
                message: error?.message,
                status: error?.status,
                code: error?.error?.error?.code,
                validationMessage: error?.error?.error?.message,
                failedGeneration: error?.error?.error?.failed_generation,
            });
            throw new microservices_1.RpcException({});
        }
    }
};
exports.AssessmentService = AssessmentService;
exports.AssessmentService = AssessmentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('CONTENT_GRPC_CLIENT')),
    __metadata("design:paramtypes", [Object, groq_service_1.GroqService,
        study_client_1.StudyClient,
        api_gateway_client_1.ApiGatewayClient])
], AssessmentService);
//# sourceMappingURL=assessment.service.js.map
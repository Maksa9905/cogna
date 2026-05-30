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
var TranscriptionService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TranscriptionService = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const transcription_cache_service_1 = require("./transcription-cache.service");
const microservices_1 = require("@nestjs/microservices");
const groq_service_1 = require("../../groq/groq.service");
const groq_sdk_1 = require("groq-sdk");
let TranscriptionService = TranscriptionService_1 = class TranscriptionService {
    groqService;
    cache;
    logger = new common_1.Logger(TranscriptionService_1.name);
    constructor(groqService, cache) {
        this.groqService = groqService;
        this.cache = cache;
    }
    handleTranscriptionStream(message$) {
        return new rxjs_1.Observable((observer) => {
            let audioBuffer = Buffer.alloc(0);
            let lastMetadata;
            message$.subscribe({
                next: (msg) => {
                    audioBuffer = Buffer.concat([
                        audioBuffer,
                        Buffer.from(msg.audioContent),
                    ]);
                    lastMetadata = msg;
                },
                error: (err) => observer.error(err),
                complete: () => {
                    if (!lastMetadata) {
                        throw new Error('No data received');
                    }
                    void (async () => {
                        try {
                            const text = await this.transcribe(audioBuffer);
                            await this.cache.saveChunksByAttempt(lastMetadata.attemptId, lastMetadata.chunkIndex, text);
                            if (!lastMetadata.isLast) {
                                observer.next({
                                    attemptId: lastMetadata.attemptId,
                                    chunkIndex: lastMetadata.chunkIndex,
                                    text: text,
                                    isFinal: lastMetadata.isLast,
                                });
                            }
                            else {
                                const finalText = await this.cache.getFullTranscription(lastMetadata.attemptId);
                                observer.next({
                                    attemptId: lastMetadata.attemptId,
                                    chunkIndex: lastMetadata.chunkIndex,
                                    text: finalText,
                                    isFinal: lastMetadata.isLast,
                                });
                            }
                            observer.complete();
                        }
                        catch (e) {
                            observer.error(e);
                        }
                    })();
                },
            });
        });
    }
    async transcribe(bufferFile) {
        try {
            this.logger.log('start transcription...');
            const response = await this.groqService.client.audio.transcriptions.create({
                model: 'whisper-large-v3-turbo',
                file: await groq_sdk_1.default.toFile(bufferFile, 'audio.mp3'),
                response_format: 'verbose_json',
                language: 'ru',
            });
            return response.text;
        }
        catch (e) {
            this.logger.error('Ошибка при отправке groq api', e);
            throw new microservices_1.RpcException({});
        }
    }
};
exports.TranscriptionService = TranscriptionService;
exports.TranscriptionService = TranscriptionService = TranscriptionService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [groq_service_1.GroqService,
        transcription_cache_service_1.TranscriptionCacheService])
], TranscriptionService);
//# sourceMappingURL=transcription.service.js.map
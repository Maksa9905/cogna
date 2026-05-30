"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TranscriptionCacheModule = void 0;
const common_1 = require("@nestjs/common");
const transcription_cache_service_1 = require("./transcription-cache.service");
const nestjs_redis_1 = require("@liaoliaots/nestjs-redis");
const config_1 = require("@nestjs/config");
let TranscriptionCacheModule = class TranscriptionCacheModule {
};
exports.TranscriptionCacheModule = TranscriptionCacheModule;
exports.TranscriptionCacheModule = TranscriptionCacheModule = __decorate([
    (0, common_1.Module)({
        imports: [
            nestjs_redis_1.RedisModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    readyLog: true,
                    config: {
                        host: config.getOrThrow('REDIS_HOST', 'localhost'),
                        port: config.getOrThrow('REDIS_PORT', 6379),
                    },
                }),
            }),
        ],
        providers: [transcription_cache_service_1.TranscriptionCacheService],
        exports: [transcription_cache_service_1.TranscriptionCacheService],
    })
], TranscriptionCacheModule);
//# sourceMappingURL=transcription-cache.module.js.map
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
exports.GroqService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const groq_sdk_1 = require("groq-sdk");
const https_proxy_agent_1 = require("https-proxy-agent");
let GroqService = class GroqService {
    configService;
    _groq;
    constructor(configService) {
        this.configService = configService;
        const proxyUrl = configService.getOrThrow('PROXY_URL');
        const apiKey = configService.getOrThrow('GROQ_API_KEY');
        const agent = new https_proxy_agent_1.HttpsProxyAgent(proxyUrl);
        this._groq = new groq_sdk_1.default({
            apiKey,
            httpAgent: agent,
        });
    }
    get client() {
        return this._groq;
    }
};
exports.GroqService = GroqService;
exports.GroqService = GroqService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], GroqService);
//# sourceMappingURL=groq.service.js.map
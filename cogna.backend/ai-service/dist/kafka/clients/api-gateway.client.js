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
var ApiGatewayClient_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiGatewayClient = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const rxjs_1 = require("rxjs");
let ApiGatewayClient = ApiGatewayClient_1 = class ApiGatewayClient {
    client;
    logger = new common_1.Logger(ApiGatewayClient_1.name);
    constructor(client) {
        this.client = client;
    }
    async onModuleInit() {
        await this.client.connect();
        this.logger.log('API Gateway Kafka producer connected');
    }
    async emitAssessmentCompleted(data) {
        await (0, rxjs_1.firstValueFrom)(this.client.emit('assessment.completed', data));
    }
};
exports.ApiGatewayClient = ApiGatewayClient;
exports.ApiGatewayClient = ApiGatewayClient = ApiGatewayClient_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('API_GATEWAY_KAFKA_PRODUCER')),
    __metadata("design:paramtypes", [microservices_1.ClientKafka])
], ApiGatewayClient);
//# sourceMappingURL=api-gateway.client.js.map
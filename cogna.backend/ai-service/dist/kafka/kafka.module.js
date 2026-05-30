"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KafkaModule = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const config_1 = require("@nestjs/config");
const study_client_1 = require("./clients/study.client");
const api_gateway_client_1 = require("./clients/api-gateway.client");
let KafkaModule = class KafkaModule {
};
exports.KafkaModule = KafkaModule;
exports.KafkaModule = KafkaModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            microservices_1.ClientsModule.registerAsync([
                {
                    name: 'STUDY_KAFKA_PRODUCER',
                    imports: [config_1.ConfigModule],
                    inject: [config_1.ConfigService],
                    useFactory: (config) => ({
                        transport: microservices_1.Transport.KAFKA,
                        options: {
                            producerOnlyMode: true,
                            client: {
                                clientId: 'study_producer',
                                brokers: config.getOrThrow('KAFKA_BROKERS').split(','),
                            },
                            producer: {
                                retry: { retries: 3 },
                            },
                        },
                    }),
                },
                {
                    name: 'API_GATEWAY_KAFKA_PRODUCER',
                    imports: [config_1.ConfigModule],
                    inject: [config_1.ConfigService],
                    useFactory: (config) => ({
                        transport: microservices_1.Transport.KAFKA,
                        options: {
                            producerOnlyMode: true,
                            client: {
                                clientId: 'api_gateway_producer',
                                brokers: config.getOrThrow('KAFKA_BROKERS').split(','),
                            },
                            producer: {
                                retry: { retries: 3 },
                            },
                        },
                    }),
                },
            ]),
        ],
        providers: [study_client_1.StudyClient, api_gateway_client_1.ApiGatewayClient],
        exports: [study_client_1.StudyClient, api_gateway_client_1.ApiGatewayClient],
    })
], KafkaModule);
//# sourceMappingURL=kafka.module.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const config_1 = require("@nestjs/config");
const microservices_1 = require("@nestjs/microservices");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const config = app.get(config_1.ConfigService);
    app.connectMicroservice({
        transport: microservices_1.Transport.GRPC,
        options: {
            package: ['thesis.v1', 'transcription.v1'],
            protoPath: [
                'node_modules/@cogna-edu/contracts/proto/thesis/thesis.proto',
                'node_modules/@cogna-edu/contracts/proto/transcription/transcription.proto',
            ],
            url: config.getOrThrow('AI_GRPC_URL', '0.0.0.0:50051'),
            loader: {
                includeDirs: ['node_modules/@cogna-edu/contracts/proto'],
            },
        },
    });
    app.connectMicroservice({
        transport: microservices_1.Transport.KAFKA,
        options: {
            client: {
                brokers: config.getOrThrow('KAFKA_BROKERS').split(','),
                clientId: 'ai_service',
            },
            consumer: {
                groupId: 'ai_consumer',
                sessionTimeout: 10000,
                heartbeatInterval: 3000,
                allowAutoTopicCreation: true,
            },
            run: {
                autoCommit: false,
            },
        },
    });
    await app.startAllMicroservices();
    await app.listen(config.get('AI_HTTP_PORT', 4003));
    console.log('ai-service started: gRPC :50051, HTTP :4003');
}
bootstrap();
//# sourceMappingURL=main.js.map
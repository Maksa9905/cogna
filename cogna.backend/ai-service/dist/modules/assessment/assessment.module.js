"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssessmentModule = void 0;
const common_1 = require("@nestjs/common");
const assessment_service_1 = require("./assessment.service");
const assessment_controller_1 = require("./assessment.controller");
const microservices_1 = require("@nestjs/microservices");
const config_1 = require("@nestjs/config");
let AssessmentModule = class AssessmentModule {
};
exports.AssessmentModule = AssessmentModule;
exports.AssessmentModule = AssessmentModule = __decorate([
    (0, common_1.Module)({
        imports: [
            microservices_1.ClientsModule.registerAsync([
                {
                    name: 'CONTENT_GRPC_CLIENT',
                    imports: [config_1.ConfigModule],
                    inject: [config_1.ConfigService],
                    useFactory: (config) => ({
                        transport: microservices_1.Transport.GRPC,
                        options: {
                            package: ['ticket.v1'],
                            url: config.getOrThrow('CONTENT_GRPC_URL', 'localhost:50052'),
                            protoPath: [
                                'node_modules/@cogna-edu/contracts/proto/content/ticket.proto',
                            ],
                            loader: {
                                includeDirs: ['node_modules/@cogna-edu/contracts/proto'],
                                defaults: true,
                            },
                        },
                    }),
                },
            ]),
        ],
        controllers: [assessment_controller_1.AssessmentController],
        providers: [assessment_service_1.AssessmentService],
    })
], AssessmentModule);
//# sourceMappingURL=assessment.module.js.map
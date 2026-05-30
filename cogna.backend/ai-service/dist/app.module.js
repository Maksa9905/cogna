"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const groq_module_1 = require("./groq/groq.module");
const kafka_module_1 = require("./kafka/kafka.module");
const thesis_module_1 = require("./modules/thesis/thesis.module");
const assessment_module_1 = require("./modules/assessment/assessment.module");
const transcription_module_1 = require("./modules/transcription/transcription.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            groq_module_1.GroqModule,
            kafka_module_1.KafkaModule,
            thesis_module_1.ThesisModule,
            assessment_module_1.AssessmentModule,
            transcription_module_1.TranscriptionModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map
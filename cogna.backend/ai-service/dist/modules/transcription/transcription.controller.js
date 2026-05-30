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
exports.TranscriptionController = void 0;
const common_1 = require("@nestjs/common");
const transcription_service_1 = require("./transcription.service");
const transcription_1 = require("@cogna-edu/contracts/dist/transcription/transcription");
const rxjs_1 = require("rxjs");
const microservices_1 = require("@nestjs/microservices");
let TranscriptionController = class TranscriptionController {
    transcriptionService;
    constructor(transcriptionService) {
        this.transcriptionService = transcriptionService;
    }
    transcribeChunk(message$) {
        return this.transcriptionService.handleTranscriptionStream(message$);
    }
};
exports.TranscriptionController = TranscriptionController;
__decorate([
    (0, microservices_1.GrpcStreamMethod)('TranscriptionService', 'TranscribeChunk'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [rxjs_1.Observable]),
    __metadata("design:returntype", rxjs_1.Observable)
], TranscriptionController.prototype, "transcribeChunk", null);
exports.TranscriptionController = TranscriptionController = __decorate([
    (0, common_1.Controller)('transcription'),
    (0, transcription_1.TranscriptionServiceControllerMethods)(),
    __metadata("design:paramtypes", [transcription_service_1.TranscriptionService])
], TranscriptionController);
//# sourceMappingURL=transcription.controller.js.map
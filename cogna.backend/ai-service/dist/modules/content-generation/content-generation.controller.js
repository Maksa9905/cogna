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
exports.ContentGenerationController = void 0;
const common_1 = require("@nestjs/common");
const content_generation_service_1 = require("./content-generation.service");
const thesis_1 = require("@cogna-edu/contracts/dist/thesis/thesis");
let ContentGenerationController = class ContentGenerationController {
    service;
    constructor(service) {
        this.service = service;
    }
    createThesis(request) {
        return this.service.generateThesis(request);
    }
    generateAnswer(request) {
        return this.service.generateAnswer(request);
    }
};
exports.ContentGenerationController = ContentGenerationController;
exports.ContentGenerationController = ContentGenerationController = __decorate([
    (0, common_1.Controller)('thesis'),
    (0, thesis_1.ThesisServiceControllerMethods)(),
    __metadata("design:paramtypes", [content_generation_service_1.ContentGenerationService])
], ContentGenerationController);
//# sourceMappingURL=content-generation.controller.js.map
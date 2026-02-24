"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RpcToHttpMap = void 0;
const common_1 = require("@nestjs/common");
const enum_1 = require("../enum");
exports.RpcToHttpMap = {
    [enum_1.RpcStatus.OK]: common_1.HttpStatus.OK,
    [enum_1.RpcStatus.INVALID_ARGUMENT]: common_1.HttpStatus.BAD_REQUEST,
    [enum_1.RpcStatus.UNAUTHENTICATED]: common_1.HttpStatus.UNAUTHORIZED,
    [enum_1.RpcStatus.PERMISSION_DENIED]: common_1.HttpStatus.FORBIDDEN,
    [enum_1.RpcStatus.NOT_FOUND]: common_1.HttpStatus.NOT_FOUND,
    [enum_1.RpcStatus.ALREADY_EXISTS]: common_1.HttpStatus.CONFLICT,
    [enum_1.RpcStatus.RESOURCE_EXHAUSTED]: common_1.HttpStatus.TOO_MANY_REQUESTS,
    [enum_1.RpcStatus.CANCELLED]: 499,
    [enum_1.RpcStatus.INTERNAL]: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
    [enum_1.RpcStatus.NOT_IMPLEMENTED]: common_1.HttpStatus.NOT_IMPLEMENTED,
    [enum_1.RpcStatus.UNAVAILABLE]: common_1.HttpStatus.SERVICE_UNAVAILABLE,
    [enum_1.RpcStatus.DEADLINE_EXCEEDED]: common_1.HttpStatus.GATEWAY_TIMEOUT,
    [enum_1.RpcStatus.DATA_LOSS]: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
    [enum_1.RpcStatus.UNKNOWN]: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
};

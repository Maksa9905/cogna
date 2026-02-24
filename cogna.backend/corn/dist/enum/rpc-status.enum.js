"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RpcStatus = void 0;
var RpcStatus;
(function (RpcStatus) {
    // Успешный запрос
    RpcStatus[RpcStatus["OK"] = 0] = "OK";
    // Ошибки клиента (4xx)
    RpcStatus[RpcStatus["INVALID_ARGUMENT"] = 1] = "INVALID_ARGUMENT";
    RpcStatus[RpcStatus["UNAUTHENTICATED"] = 2] = "UNAUTHENTICATED";
    RpcStatus[RpcStatus["PERMISSION_DENIED"] = 3] = "PERMISSION_DENIED";
    RpcStatus[RpcStatus["NOT_FOUND"] = 4] = "NOT_FOUND";
    RpcStatus[RpcStatus["ALREADY_EXISTS"] = 5] = "ALREADY_EXISTS";
    RpcStatus[RpcStatus["RESOURCE_EXHAUSTED"] = 6] = "RESOURCE_EXHAUSTED";
    RpcStatus[RpcStatus["CANCELLED"] = 7] = "CANCELLED";
    // Ошибки сервера (5xx)
    RpcStatus[RpcStatus["INTERNAL"] = 8] = "INTERNAL";
    RpcStatus[RpcStatus["NOT_IMPLEMENTED"] = 9] = "NOT_IMPLEMENTED";
    RpcStatus[RpcStatus["UNAVAILABLE"] = 10] = "UNAVAILABLE";
    RpcStatus[RpcStatus["DEADLINE_EXCEEDED"] = 11] = "DEADLINE_EXCEEDED";
    // Специфические случаи
    RpcStatus[RpcStatus["DATA_LOSS"] = 12] = "DATA_LOSS";
    RpcStatus[RpcStatus["UNKNOWN"] = 13] = "UNKNOWN"; // Ошибка, которую не удалось классифицировать
})(RpcStatus || (exports.RpcStatus = RpcStatus = {}));

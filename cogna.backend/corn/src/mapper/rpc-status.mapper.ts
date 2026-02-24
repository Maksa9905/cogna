import { HttpStatus } from '@nestjs/common';
import {RpcStatus} from "../enum";

export const RpcToHttpMap: Record<number, number> = {
    [RpcStatus.OK]: HttpStatus.OK,
    [RpcStatus.INVALID_ARGUMENT]: HttpStatus.BAD_REQUEST,
    [RpcStatus.UNAUTHENTICATED]: HttpStatus.UNAUTHORIZED,
    [RpcStatus.PERMISSION_DENIED]: HttpStatus.FORBIDDEN,
    [RpcStatus.NOT_FOUND]: HttpStatus.NOT_FOUND,
    [RpcStatus.ALREADY_EXISTS]: HttpStatus.CONFLICT,
    [RpcStatus.RESOURCE_EXHAUSTED]: HttpStatus.TOO_MANY_REQUESTS,
    [RpcStatus.CANCELLED]: 499,
    [RpcStatus.INTERNAL]: HttpStatus.INTERNAL_SERVER_ERROR,
    [RpcStatus.NOT_IMPLEMENTED]: HttpStatus.NOT_IMPLEMENTED,
    [RpcStatus.UNAVAILABLE]: HttpStatus.SERVICE_UNAVAILABLE,
    [RpcStatus.DEADLINE_EXCEEDED]: HttpStatus.GATEWAY_TIMEOUT,
    [RpcStatus.DATA_LOSS]: HttpStatus.INTERNAL_SERVER_ERROR,
    [RpcStatus.UNKNOWN]: HttpStatus.INTERNAL_SERVER_ERROR,
};
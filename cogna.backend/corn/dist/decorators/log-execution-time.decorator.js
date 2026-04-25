"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogExecutionTime = LogExecutionTime;
const common_1 = require("@nestjs/common");
/**
 * Логирует длительность sync/async-метода (Nest Logger: у экземпляра или по имени класса).
 */
function LogExecutionTime() {
    return function (target, propertyKey, descriptor) {
        const original = descriptor.value;
        if (typeof original !== 'function') {
            return descriptor;
        }
        const className = target.constructor?.name ??
            'Unknown';
        const keyStr = String(propertyKey);
        descriptor.value = function (...args) {
            const logger = this?.logger instanceof common_1.Logger
                ? this.logger
                : new common_1.Logger(className);
            const start = performance.now();
            const logMs = (suffix) => {
                const ms = (performance.now() - start).toFixed(1);
                logger.debug(`${keyStr} ${suffix} in ${ms}ms`);
            };
            const result = original.apply(this, args);
            if (result && typeof result.then === 'function') {
                return result.then((value) => {
                    logMs('completed');
                    return value;
                }, (e) => {
                    logMs('failed');
                    return Promise.reject(e);
                });
            }
            logMs('completed');
            return result;
        };
        return descriptor;
    };
}

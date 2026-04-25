import { Logger } from '@nestjs/common';

type HasOptionalLogger = { logger?: Logger };

/**
 * Логирует длительность sync/async-метода (Nest Logger: у экземпляра или по имени класса).
 */
export function LogExecutionTime() {
  return function (
    target: object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor {
    const original = descriptor.value;
    if (typeof original !== 'function') {
      return descriptor;
    }

    const className =
      (target as { constructor?: { name?: string } }).constructor?.name ??
      'Unknown';
    const keyStr = String(propertyKey);

    descriptor.value = function (
      this: HasOptionalLogger,
      ...args: unknown[]
    ): unknown {
      const logger: Logger =
        this?.logger instanceof Logger
          ? this.logger
          : new Logger(className);
      const start = performance.now();
      const logMs = (suffix: 'completed' | 'failed') => {
        const ms = (performance.now() - start).toFixed(1);
        logger.debug(`${keyStr} ${suffix} in ${ms}ms`);
      };

      const result: unknown = original.apply(this, args);

      if (result && typeof (result as Promise<unknown>).then === 'function') {
        return (result as Promise<unknown>).then(
          (value) => {
            logMs('completed');
            return value;
          },
          (e: unknown) => {
            logMs('failed');
            return Promise.reject(e);
          },
        );
      }
      logMs('completed');
      return result;
    };

    return descriptor;
  };
}

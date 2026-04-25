/**
 * Логирует длительность sync/async-метода (Nest Logger: у экземпляра или по имени класса).
 */
export declare function LogExecutionTime(): (target: object, propertyKey: string | symbol, descriptor: PropertyDescriptor) => PropertyDescriptor;

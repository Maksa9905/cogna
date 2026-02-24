export declare enum RpcStatus {
    OK = 0,
    INVALID_ARGUMENT = 1,// Неверные данные в запросе (400)
    UNAUTHENTICATED = 2,// Требуется авторизация (401)
    PERMISSION_DENIED = 3,// Нет доступа к ресурсу (403)
    NOT_FOUND = 4,// Ресурс не найден (404)
    ALREADY_EXISTS = 5,// Конфликт данных (409)
    RESOURCE_EXHAUSTED = 6,// Лимит запросов/квота исчерпана (429)
    CANCELLED = 7,// Операция отменена клиентом (499)
    INTERNAL = 8,// Общая ошибка сервера (500)
    NOT_IMPLEMENTED = 9,// Метод не реализован (501)
    UNAVAILABLE = 10,// Сервис временно недоступен (503)
    DEADLINE_EXCEEDED = 11,// Таймаут операции (504)
    DATA_LOSS = 12,// Необратимая потеря или повреждение данных
    UNKNOWN = 13
}

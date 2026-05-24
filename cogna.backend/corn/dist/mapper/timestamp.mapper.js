"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toTimestamp = toTimestamp;
function toTimestamp(date) {
    return {
        seconds: Math.floor(date.getTime() / 1000),
        nanos: (date.getTime() % 1000) * 1e6,
    };
}

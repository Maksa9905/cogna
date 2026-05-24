export function toTimestamp(date: Date): { seconds: number; nanos: number } {
  return {
    seconds: Math.floor(date.getTime() / 1000),
    nanos: (date.getTime() % 1000) * 1e6,
  };
}

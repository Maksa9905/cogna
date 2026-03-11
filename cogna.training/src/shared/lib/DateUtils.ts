export class DateUtils {
	static readonly MS_PER_MINUTE = 60 * 1000;
	static readonly MS_PER_HOUR = 60 * DateUtils.MS_PER_MINUTE;
	static readonly MS_PER_DAY = 24 * DateUtils.MS_PER_HOUR;

	/** Начало календарного дня (00:00:00.000) в локальной таймзоне */
	static startOfDay(date: Date): Date {
		return new Date(date.getFullYear(), date.getMonth(), date.getDate());
	}

	/** Разница в миллисекундах: to - from */
	static diffMs(from: Date, to: Date): number {
		return to.getTime() - from.getTime();
	}

	/** Разница в полных минутах (floor) */
	static diffMinutes(from: Date, to: Date): number {
		return Math.floor(DateUtils.diffMs(from, to) / DateUtils.MS_PER_MINUTE);
	}

	/** Разница в полных часах (floor) */
	static diffHours(from: Date, to: Date): number {
		return Math.floor(DateUtils.diffMs(from, to) / DateUtils.MS_PER_HOUR);
	}

	/** Разница в календарных днях (floor) по началу дня */
	static daysBetween(from: Date, to: Date): number {
		const fromStart = DateUtils.startOfDay(from).getTime();
		const toStart = DateUtils.startOfDay(to).getTime();
		return Math.floor((toStart - fromStart) / DateUtils.MS_PER_DAY);
	}

	/** Количество дней до целевой даты (ceil по абсолютной разнице в сутках). Для экзаменов и дедлайнов. */
	static getRemainingDays(targetDateString: string, from: Date = new Date()): number {
		const target = new Date(targetDateString);
		const diffTime = Math.abs(DateUtils.diffMs(from, target));
		return Math.ceil(diffTime / DateUtils.MS_PER_DAY);
	}
}

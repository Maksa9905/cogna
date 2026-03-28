import { DateUtils } from "@/shared/lib";

export enum TimeSinceLastRepetitionType {
	Recently = "recently",
	Minutes = "minutes",
	Hours = "hours",
	Yesterday = "yesterday",
	Days = "days",
	Months = "months",
}

export type TimeSinceLastRepetition =
	| { value: null; type: TimeSinceLastRepetitionType.Recently }
	| { value: number; type: TimeSinceLastRepetitionType.Minutes }
	| { value: number; type: TimeSinceLastRepetitionType.Hours }
	| { value: null; type: TimeSinceLastRepetitionType.Yesterday }
	| { value: number; type: TimeSinceLastRepetitionType.Days }
	| { value: number; type: TimeSinceLastRepetitionType.Months };

export class SubjectsListItemUtils {
	static getRemainingDays(examinationDateString: string): number {
		return DateUtils.getRemainingDays(examinationDateString);
	}

	static getTimeSinceLastRepetition(latestLessonDateString: string): TimeSinceLastRepetition {
		const now = new Date();
		const latest = new Date(latestLessonDateString);
		const diffMs = DateUtils.diffMs(latest, now);

		if (diffMs < 0) {
			return { value: null, type: TimeSinceLastRepetitionType.Recently };
		}

		const diffMinutes = DateUtils.diffMinutes(latest, now);
		const diffHours = DateUtils.diffHours(latest, now);
		const daysDiff = DateUtils.daysBetween(latest, now);

		if (diffMinutes < 30) return { value: null, type: TimeSinceLastRepetitionType.Recently };
		if (diffMinutes < 60) return { value: diffMinutes, type: TimeSinceLastRepetitionType.Minutes };
		if (daysDiff === 0 && diffHours >= 1)
			return { value: diffHours, type: TimeSinceLastRepetitionType.Hours };
		if (daysDiff === 1) return { value: null, type: TimeSinceLastRepetitionType.Yesterday };
		if (daysDiff >= 2 && daysDiff <= 30)
			return { value: daysDiff, type: TimeSinceLastRepetitionType.Days };

		const months = Math.floor(daysDiff / 30);
		return { value: months, type: TimeSinceLastRepetitionType.Months };
	}

	static getLastRepetitionMessage(ts: TimeSinceLastRepetition): { key: string; n?: number } {
		const base = "subjects.lastRepetition.";
		switch (ts.type) {
			case TimeSinceLastRepetitionType.Recently:
			case TimeSinceLastRepetitionType.Yesterday:
				return { key: `${base}${ts.type}` };
			case TimeSinceLastRepetitionType.Minutes:
			case TimeSinceLastRepetitionType.Hours:
			case TimeSinceLastRepetitionType.Days:
			case TimeSinceLastRepetitionType.Months:
				return { key: `${base}${ts.type}`, n: ts.value };
		}
	}
}

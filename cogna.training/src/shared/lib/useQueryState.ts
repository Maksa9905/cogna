import { computed, type WritableComputedRef } from "vue";
import { useRoute, useRouter, type LocationQueryRaw, type LocationQueryValue } from "vue-router";

function queryValueToString(raw: LocationQueryValue | LocationQueryValue[] | undefined): string | undefined {
	if (raw == null) {
		return undefined;
	}
	if (Array.isArray(raw)) {
		return raw[0] != null ? String(raw[0]) : undefined;
	}
	return String(raw);
}

export type UseQueryStateOptions<T extends string = string> = {
	default?: T;
	history?: "replace" | "push";
};

export function useQueryState<T extends string = string>(
	key: string,
	queryOptions?: UseQueryStateOptions<T>,
): WritableComputedRef<T> {
	const route = useRoute();
	const router = useRouter();
	const defaultValue = (queryOptions?.default ?? "") as T;
	const history = queryOptions?.history ?? "replace";

	return computed({
		get(): T {
			return (queryValueToString(route.query[key]) ?? defaultValue) as T;
		},
		set(value: T) {
			const next: LocationQueryRaw = { ...route.query };
			if (value === defaultValue) {
				delete next[key];
			} else {
				next[key] = value;
			}
			void router[history]({ query: next });
		},
	});
}

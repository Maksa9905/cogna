import { onScopeDispose, ref, type Ref } from "vue";

export function useMediaQuery(query: string): Ref<boolean> {
	const matches = ref(false);

	if (typeof window === "undefined") {
		return matches;
	}

	const mql = window.matchMedia(query);
	matches.value = mql.matches;

	const listener = () => {
		matches.value = mql.matches;
	};

	if (typeof mql.addEventListener === "function") {
		mql.addEventListener("change", listener);
		onScopeDispose(() => mql.removeEventListener("change", listener));
	} else {
		mql.addListener(listener);
		onScopeDispose(() => mql.removeListener(listener));
	}

	return matches;
}

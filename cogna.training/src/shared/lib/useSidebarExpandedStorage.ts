import { ref, watch } from "vue";

const SIDEBAR_EXPANDED_KEY = "cogna.sidebar.expanded";

function readStored(): boolean | undefined {
	if (typeof window === "undefined") return undefined;
	try {
		const raw = localStorage.getItem(SIDEBAR_EXPANDED_KEY);
		if (raw === "true") return true;
		if (raw === "false") return false;
	} catch {
		/* quota / private mode */
	}
	return undefined;
}

/** Состояние развёрнутости сайдбара с сохранением в `localStorage`. */
export function useSidebarExpandedStorage(defaultExpanded = true) {
	const expanded = ref(defaultExpanded);

	const stored = readStored();
	if (stored !== undefined) {
		expanded.value = stored;
	}

	watch(expanded, (value) => {
		if (typeof window === "undefined") return;
		try {
			localStorage.setItem(SIDEBAR_EXPANDED_KEY, String(value));
		} catch {
			/* ignore */
		}
	});

	return expanded;
}

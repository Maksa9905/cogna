/** Скелетон / подпись «загрузка» показываются только если запрос длится дольше этого порога. */
export const INFINITY_SCROLL_LOADING_UI_DELAY_MS = 200;

export const INFINITY_SCROLL_KEY = Symbol("InfinityScroll") as symbol;

export interface InfinityScrollContext {
	items: { value: unknown[] };
	loading: { value: boolean };
	hasMore: { value: boolean };
	firstPageLoaded: { value: boolean };
	firstPageEmpty: { value: boolean };
	triggerLoadMore: () => Promise<void>;
}

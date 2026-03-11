export const INFINITY_SCROLL_KEY = Symbol("InfinityScroll") as symbol;

export interface InfinityScrollContext {
	items: { value: unknown[] };
	loading: { value: boolean };
	hasMore: { value: boolean };
	triggerLoadMore: () => Promise<void>;
}

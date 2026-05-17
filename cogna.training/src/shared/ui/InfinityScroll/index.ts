import InfinityScroll from "./InfinityScroll.vue";
import InfinityScrollEmpty from "./InfinityScrollEmpty.vue";
import InfinityScrollMark from "./InfinityScrollMark.vue";
import InfinityScrollList from "./InfinityScrollList.vue";

export type LoadMoreParams = {
	offset: number;
	limit?: number;
};

export type LoadMoreResult<T = unknown> = {
	items: T[];
	hasMore: boolean;
};

const InfinityScrollWithSub = InfinityScroll as typeof InfinityScroll & {
	Empty: typeof InfinityScrollEmpty;
	Mark: typeof InfinityScrollMark;
	List: typeof InfinityScrollList;
};

InfinityScrollWithSub.Empty = InfinityScrollEmpty;
InfinityScrollWithSub.Mark = InfinityScrollMark;
InfinityScrollWithSub.List = InfinityScrollList;

export default InfinityScrollWithSub;

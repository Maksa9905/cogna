import InfinityScroll from "./InfinityScroll.vue";
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
	Mark: typeof InfinityScrollMark;
	List: typeof InfinityScrollList;
};

InfinityScrollWithSub.Mark = InfinityScrollMark;
InfinityScrollWithSub.List = InfinityScrollList;

export default InfinityScrollWithSub;

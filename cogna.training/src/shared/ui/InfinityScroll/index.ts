import InfinityScroll from "./InfinityScroll.vue";
import InfinityScrollMark from "./InfinityScrollMark.vue";
import InfinityScrollList from "./InfinityScrollList.vue";

const InfinityScrollWithSub = InfinityScroll as typeof InfinityScroll & {
	Mark: typeof InfinityScrollMark;
	List: typeof InfinityScrollList;
};

InfinityScrollWithSub.Mark = InfinityScrollMark;
InfinityScrollWithSub.List = InfinityScrollList;

export default InfinityScrollWithSub;
export type { LoadMoreParams, LoadMoreResult } from "./InfinityScroll.vue";

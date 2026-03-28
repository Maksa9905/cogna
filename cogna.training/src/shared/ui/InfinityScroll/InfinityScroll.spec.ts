import { describe, expect, it, vi, beforeEach } from "vitest";
import { h } from "vue";
import { render, screen } from "@/test/utils";
import InfinityScroll from "./index";

const { Mark, List, Wrapper } = {
	Wrapper: InfinityScroll,
	Mark: InfinityScroll.Mark,
	List: InfinityScroll.List,
};

describe("InfinityScroll", () => {
	describe("InfinityScroll (Wrapper)", () => {
		it("рендерит слот по умолчанию", () => {
			const loadMore = vi.fn().mockResolvedValue({ items: [], hasMore: false });
			render(Wrapper, {
				props: { loadMore },
				slots: { default: () => h("div", { class: "inner" }, "Content") },
			});
			expect(screen.getByText("Content")).toBeInTheDocument();
			expect(screen.getByText("Content").closest(".infinity-scroll")).toBeInTheDocument();
		});

		it("передаёт loadMore в пропсах и не вызывает его без Mark", () => {
			const loadMore = vi.fn().mockResolvedValue({ items: [], hasMore: false });
			render(Wrapper, {
				props: { loadMore },
				slots: { default: () => h("span", {}, "Only content") },
			});
			expect(loadMore).not.toHaveBeenCalled();
		});
	});

	describe("InfinityScroll.Mark", () => {
		it("рендерит текст Loading по умолчанию", () => {
			render(Mark);
			expect(screen.getByText("Loading")).toBeInTheDocument();
		});

		it("рендерит слот вместо дефолтного текста", () => {
			render(Mark, {
				slots: { default: () => h("span", {}, "Загрузка...") },
			});
			expect(screen.getByText("Загрузка...")).toBeInTheDocument();
			expect(screen.queryByText("Loading")).not.toBeInTheDocument();
		});

		it("имеет класс infinity-scroll-mark", () => {
			const { container } = render(Mark);
			expect(container.querySelector(".infinity-scroll-mark")).toBeInTheDocument();
		});
	});

	describe("InfinityScroll.List", () => {
		it("без контекста не падает и ничего не рендерит", () => {
			const { container } = render(List);
			expect(container.querySelector(".infinity-scroll-list")).toBeInTheDocument();
			expect(container.querySelector(".infinity-scroll-list")?.children.length).toBe(0);
		});

		it("в контексте Wrapper рендерит слот для каждого item", () => {
			const loadMore = vi.fn().mockResolvedValue({
				items: [
					{ id: "1", name: "A" },
					{ id: "2", name: "B" },
				],
				hasMore: false,
			});
			render(Wrapper, {
				props: { loadMore },
				slots: {
					default: () =>
						h(List, null, {
							default: ({ item }: { item: { name: string } }) =>
								h("div", { class: "item" }, item.name),
						}),
				},
			});
			// Изначально items пустой — loadMore вызывается только когда Mark в viewport.
			// Без Mark в разметке loadMore не вызывается, поэтому список пуст.
			expect(screen.queryByText("A")).not.toBeInTheDocument();
		});
	});

	describe("InfinityScroll: интеграция Wrapper + List + Mark", () => {
		let mockObserverCallback: (entries: { isIntersecting: boolean }[]) => void;

		beforeEach(() => {
			vi.stubGlobal(
				"IntersectionObserver",
				class MockIntersectionObserver {
					constructor(cb: (entries: { isIntersecting: boolean }[]) => void) {
						mockObserverCallback = cb;
					}
					observe = vi.fn();
					disconnect = vi.fn();
					unobserve = vi.fn();
					takeRecords = vi.fn(() => []);
				},
			);
		});

		it("при появлении Mark во вьюпорте вызывается loadMore и элементы появляются в List", async () => {
			const loadMore = vi
				.fn()
				.mockResolvedValueOnce({
					items: [
						{ id: "1", title: "First" },
						{ id: "2", title: "Second" },
					],
					hasMore: true,
				})
				.mockResolvedValueOnce({ items: [], hasMore: false });

			render(Wrapper, {
				props: { loadMore, limit: 2 },
				slots: {
					default: () => [
						h(List, null, {
							default: ({ item }: { item: { title: string } }) =>
								h("div", { class: "list-item" }, item.title),
						}),
						h(Mark),
					],
				},
			});

			expect(loadMore).not.toHaveBeenCalled();
			expect(screen.queryByText("First")).not.toBeInTheDocument();

			mockObserverCallback([{ isIntersecting: true }]);

			await vi.waitFor(() => {
				expect(loadMore).toHaveBeenCalledWith({ offset: 0, limit: 2 });
			});

			await vi.waitFor(() => {
				expect(screen.getByText("First")).toBeInTheDocument();
				expect(screen.getByText("Second")).toBeInTheDocument();
			});
		});

		it("при повторном появлении Mark подгружается вторая страница и мержится со списком", async () => {
			const loadMore = vi
				.fn()
				.mockResolvedValueOnce({
					items: [{ id: "1", name: "A" }],
					hasMore: true,
				})
				.mockResolvedValueOnce({
					items: [{ id: "2", name: "B" }],
					hasMore: false,
				});

			render(Wrapper, {
				props: { loadMore, limit: 1 },
				slots: {
					default: () => [
						h(List, null, {
							default: ({ item }: { item: { name: string } }) =>
								h("div", { class: "list-item" }, item.name),
						}),
						h(Mark),
					],
				},
			});

			mockObserverCallback([{ isIntersecting: true }]);
			await vi.waitFor(() => expect(screen.getByText("A")).toBeInTheDocument());
			expect(loadMore).toHaveBeenCalledTimes(1);

			mockObserverCallback([{ isIntersecting: true }]);
			await vi.waitFor(() => expect(screen.getByText("B")).toBeInTheDocument());
			expect(loadMore).toHaveBeenCalledTimes(2);
			expect(loadMore).toHaveBeenNthCalledWith(2, { offset: 1, limit: 1 });
			expect(screen.getByText("A")).toBeInTheDocument();
			expect(screen.getByText("B")).toBeInTheDocument();
		});

		it("не вызывает loadMore при hasMore: false", async () => {
			const loadMore = vi.fn().mockResolvedValue({ items: [{ x: 1 }], hasMore: false });

			render(Wrapper, {
				props: { loadMore },
				slots: {
					default: () => [h(List), h(Mark)],
				},
			});

			mockObserverCallback([{ isIntersecting: true }]);
			await vi.waitFor(() => expect(loadMore).toHaveBeenCalledTimes(1));

			mockObserverCallback([{ isIntersecting: true }]);
			mockObserverCallback([{ isIntersecting: true }]);
			expect(loadMore).toHaveBeenCalledTimes(1);
		});
	});

	it("совпадает со snapshot при полной сборке Wrapper + List + Mark", () => {
		const loadMore = vi.fn().mockResolvedValue({ items: [], hasMore: false });
		const { container } = render(Wrapper, {
			props: { loadMore },
			slots: {
				default: () => [
					h(List, null, {
						default: ({ item }: { item: { name: string } }) =>
							h("div", { class: "item" }, item.name),
					}),
					h(Mark, null, { default: () => "Loading..." }),
				],
			},
		});
		expect(container.innerHTML).toMatchSnapshot();
	});
});

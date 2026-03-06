import { describe, expect, it } from "vitest";
import { h } from "vue";
import { render, screen } from "@/test/utils";
import FeaturesList from "./index";

const Item = FeaturesList.Item;
const ItemIcon = Item.Icon;
const ItemTitle = Item.Title;
const ItemDescription = Item.Description;

function renderItem(icon: string, title: string, description: string) {
	return h(Item, {}, {
		default: () => [
			h(ItemIcon, {}, () => icon),
			h(ItemTitle, {}, () => title),
			h(ItemDescription, {}, () => description),
		],
	});
}

describe("FeaturesList", () => {
	it("рендерит список как ul", () => {
		const { container } = render(FeaturesList, {
			slots: { default: () => h("li", {}, "Item") },
		});
		const list = container.querySelector("ul.features-list");
		expect(list).toBeInTheDocument();
		expect(list?.tagName).toBe("UL");
	});

	it("рендерит слот по умолчанию", () => {
		render(FeaturesList, {
			slots: { default: () => h("li", {}, "Первый пункт") },
		});
		expect(screen.getByText("Первый пункт")).toBeInTheDocument();
	});

	it("рендерит compound-структуру: Item, Icon, Title, Description", () => {
		render(FeaturesList, {
			slots: {
				default: () => renderItem("🔷", "Заголовок", "Описание фичи"),
			},
		});

		expect(screen.getByText("Заголовок")).toBeInTheDocument();
		expect(screen.getByText("Описание фичи")).toBeInTheDocument();
		expect(screen.getByText("🔷")).toBeInTheDocument();
	});

	it("рендерит несколько элементов", () => {
		render(FeaturesList, {
			slots: {
				default: () => [
					renderItem("1", "Фича 1", "Описание 1"),
					renderItem("2", "Фича 2", "Описание 2"),
				],
			},
		});

		expect(screen.getByText("Фича 1")).toBeInTheDocument();
		expect(screen.getByText("Фича 2")).toBeInTheDocument();
		expect(screen.getByText("Описание 1")).toBeInTheDocument();
		expect(screen.getByText("Описание 2")).toBeInTheDocument();
	});

	it("Item.Icon рендерит Badge с прозрачным вариантом", () => {
		const { container } = render(FeaturesList, {
			slots: {
				default: () => renderItem("📘", "Умные билеты", "Создавай конспекты"),
			},
		});
		expect(container.querySelector(".transparent")).toBeInTheDocument();
	});

	it("совпадает со snapshot", () => {
		const { container } = render(FeaturesList, {
			slots: {
				default: () => renderItem("📘", "Умные билеты", "Создавай структурированные конспекты"),
			},
		});
		expect(container.innerHTML).toMatchSnapshot();
	});
});

<script setup lang="ts">
import { useLocalizedRouter } from "@/shared/i18n";
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";

defineOptions({
	name: "MobileSideBar",
});

const { t } = useI18n();
const route = useRoute();
const { routes } = useLocalizedRouter();

type MobileNavItem =
	| {
			type: "route";
			to: string;
			icon: string;
			label: string;
			isActive: () => boolean;
	  }
	| {
			type: "external";
			href: string;
			icon: string;
			label: string;
	  };

const navItems = computed<MobileNavItem[]>(() => {
	const r = routes.value;
	return [
		{
			type: "route",
			to: r.home,
			icon: "i-lucide-book",
			label: t("menu.subjects"),
			isActive: () => {
				const p = route.path;
				return p === r.home || p.startsWith(`${r.home}/subjects`);
			},
		},
		{
			type: "route",
			to: r.tests,
			icon: "i-lucide-clipboard-list",
			label: t("menu.tests"),
			isActive: () => route.path === r.tests || route.path.startsWith(`${r.tests}/`),
		},
		{
			type: "route",
			to: r.statistics,
			icon: "i-lucide-bar-chart",
			label: t("menu.statistics"),
			isActive: () => route.path === r.statistics || route.path.startsWith(`${r.statistics}/`),
		},
		{
			type: "route",
			to: r.settings,
			icon: "i-lucide-settings",
			label: t("menu.settings"),
			isActive: () => route.path === r.settings || route.path.startsWith(`${r.settings}/`),
		},
		{
			type: "external",
			href: "https://t.me/hakolr",
			icon: "i-lucide-help-circle",
			label: t("menu.help"),
		},
	];
});
</script>

<template>
	<nav
		class="mobile-side-bar"
		aria-label="Основное меню"
	>
		<template v-for="(item, index) in navItems" :key="index">
			<RouterLink
				v-if="item.type === 'route'"
				v-slot="{ href, navigate }"
				:to="item.to"
				custom
			>
				<a
					:href="href"
					class="mobile-side-bar__link"
					:class="{ 'mobile-side-bar__link--active': item.isActive() }"
					:aria-current="item.isActive() ? 'page' : undefined"
					@click="navigate"
				>
					<UIcon :name="item.icon" class="mobile-side-bar__icon" />
					<span class="mobile-side-bar__label">{{ item.label }}</span>
				</a>
			</RouterLink>
			<a
				v-else
				:href="item.href"
				class="mobile-side-bar__link"
				rel="noopener noreferrer"
				target="_blank"
			>
				<UIcon :name="item.icon" class="mobile-side-bar__icon" />
				<span class="mobile-side-bar__label">{{ item.label }}</span>
			</a>
		</template>
	</nav>
</template>

<style scoped>
.mobile-side-bar {
	position: fixed;
	right: 0;
	bottom: 0;
	left: 0;
	z-index: 40;
	display: flex;
	align-items: stretch;
	justify-content: space-around;
	gap: 4px;
	min-height: 56px;
	padding: 8px 8px calc(8px + env(safe-area-inset-bottom, 0px));
	box-sizing: border-box;
	background-color: var(--ui-bg);
	border-top: 1px solid var(--ui-bg-accented);
}

.mobile-side-bar__link {
	display: flex;
	flex: 1;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 2px;
	min-width: 0;
	max-width: 88px;
	padding: 4px 2px;
	text-decoration: none;
	color: var(--text-color-dimmed);
	border-radius: 8px;
	-webkit-tap-highlight-color: transparent;
}

.mobile-side-bar__link--active {
	color: var(--color-primary, var(--ui-primary));
	background-color: var(--ui-bg-muted);
}

.mobile-side-bar__icon {
	width: 24px;
	height: 24px;
	flex-shrink: 0;
}

.mobile-side-bar__label {
	overflow: hidden;
	max-width: 100%;
	font-size: 10px;
	font-weight: 500;
	line-height: 1.2;
	text-align: center;
	text-overflow: ellipsis;
	white-space: nowrap;
}
</style>

<script setup lang="ts">
import { UserCard } from "@/entities/user";
import { useLocalizedRouter } from "@/shared/i18n";
import { Logotype } from "@/shared/ui";
import useSideBarItems from "./useSideBarItems";

defineOptions({
  name: "SideBar",
})

const expanded = defineModel<boolean>('expanded', { default: true });

const toggle = () => {
  expanded.value = !expanded.value;
}

const { routes } = useLocalizedRouter();

const items = useSideBarItems();

</script>

<template>
  <aside
    class="side-bar"
    :class="{ 'side-bar--collapsed': !expanded }"
  >
    <header class="side-bar__header">
      <Transition name="logo-transition" mode="out-in">
        <Logotype
          v-if="expanded"
          key="header-logo"
          variant="icon"
          class="side-bar__logo"
        />
      </Transition>
      <UButton @click="toggle" variant="icon" class="side-bar__toggle p-0">
        <UIcon class="side-bar-icon" name="i-lucide-sidebar" />
      </UButton>
    </header>

    <div class="side-bar__body">
      <Transition name="transition" mode="out-in">
        <div v-if="expanded" key="full" class="side-bar__panel">
          <UNavigationMenu :items="items" orientation="vertical" />
        </div>
        <div v-else key="icons" class="side-bar__panel side-bar__panel--icons">
          <RouterLink
            v-slot="{ href, navigate, isActive }"
            :to="routes.home"
            custom
          >
            <a
              :href="href"
              class="side-bar__icon-link"
              :aria-current="isActive ? 'page' : undefined"
              @click="navigate"
            >
              <UIcon
                :aria-selected="isActive ? 'true' : 'false'"
                class="side-bar-icon"
                name="i-lucide-book"
              />
            </a>
          </RouterLink>
          <RouterLink
            v-slot="{ href, navigate, isActive }"
            :to="routes.tests"
            custom
          >
            <a
              :href="href"
              class="side-bar__icon-link"
              :aria-current="isActive ? 'page' : undefined"
              @click="navigate"
            >
              <UIcon
                :aria-selected="isActive ? 'true' : 'false'"
                class="side-bar-icon"
                name="i-lucide-clipboard-list"
              />
            </a>
          </RouterLink>
          <RouterLink
            v-slot="{ href, navigate, isActive }"
            :to="routes.statistics"
            custom
          >
            <a
              :href="href"
              class="side-bar__icon-link"
              :aria-current="isActive ? 'page' : undefined"
              @click="navigate"
            >
              <UIcon
                :aria-selected="isActive ? 'true' : 'false'"
                class="side-bar-icon"
                name="i-lucide-bar-chart"
              />
            </a>
          </RouterLink>
          <RouterLink
            v-slot="{ href, navigate, isActive }"
            :to="routes.settings"
            custom
          >
            <a
              :href="href"
              class="side-bar__icon-link"
              :aria-current="isActive ? 'page' : undefined"
              @click="navigate"
            >
              <UIcon
                :aria-selected="isActive ? 'true' : 'false'"
                class="side-bar-icon"
                name="i-lucide-settings"
              />
            </a>
          </RouterLink>
          <a
            class="side-bar__icon-link"
            href="https://t.me/hakolr"
            rel="noopener noreferrer"
            target="_blank"
          >
            <UIcon class="side-bar-icon" name="i-lucide-help-circle" />
          </a>
        </div>
      </Transition>
    </div>

    <Transition name="transition" mode="out-in">
      <UserCard v-if="expanded" class="user-card" name="Alexey" />
        <UIcon v-else class="side-bar-icon" name="i-lucide-user" />
    </Transition>
  </aside>
</template>

<style scoped>
.side-bar {
  z-index: 2;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	gap: 24px;
	width: var(--sidebar-width, 320px);
	min-width: var(--sidebar-width, 320px);
	max-width: var(--sidebar-width, 320px);
	height: 100dvh;
	background-color: var(--ui-bg);
	padding: 24px;
	position: fixed;
	border-right: 1px solid var(--ui-bg-accented);
	overflow-x: hidden;
	box-sizing: border-box;
	transition:
		width 0.35s cubic-bezier(0.4, 0, 0.2, 1),
		min-width 0.35s cubic-bezier(0.4, 0, 0.2, 1),
		max-width 0.35s cubic-bezier(0.4, 0, 0.2, 1),
		padding 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.side-bar--collapsed {
	padding: 24px 21px;
}

.side-bar__header {
  position: relative;
	display: flex;
	flex-direction: row;
	align-items: center;
  justify-content: end;
  min-height: 40px;
	gap: 8px;
}

.side-bar__logo {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 0;
  width: 24px;
  height: 24px;
}

.logo-transition-enter-active,
.logo-transition-leave-active {
	transition:
		opacity 0.22s ease,
		transform 0.28s cubic-bezier(0.4, 0, 0.2, 1);
}

.logo-transition-enter-from,
.logo-transition-leave-to {
	opacity: 0;
	transform: translateY(-50%) translateX(-10px);
}

.logo-transition-enter-to,
.logo-transition-leave-from {
	opacity: 1;
	transform: translateY(-50%) translateX(0);
}

.side-bar__toggle {
	flex-shrink: 0;
}

.side-bar__header .side-bar-icon {
	cursor: pointer;
}

.side-bar__body {
	flex: 1;
	min-height: 0;
	min-width: 0;
}

.side-bar__panel {
	width: 100%;
}

.side-bar__panel--icons {
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-top: 6px;
	gap: 12px;
}

.side-bar__icon-link {
	display: flex;
	align-items: center;
	justify-content: center;
	text-decoration: none;
	color: inherit;
	border-radius: 4px;
}

.side-bar-icon {
	width: 28px;
	height: 28px;
	padding: 4px;
	color: var(--text-color-dimmed);
	border-radius: 4px;
}

.side-bar-icon[aria-selected="true"] {
	color: var(--color-primary);
	background-color: var(--ui-bg-muted);
}

.transition-enter-active,
.transition-leave-active {
	transition:
		opacity 0.22s ease,
		transform 0.28s cubic-bezier(0.4, 0, 0.2, 1);
}

.transition-enter-from,
.transition-leave-to {
	opacity: 0;
	transform: translateX(-10px);
}

.transition-enter-to,
.transition-leave-from {
	opacity: 1;
	transform: translateX(0);
}

.user-card {
	margin-top: auto;
	min-width: 0;
}

@media (prefers-reduced-motion: reduce) {
	.side-bar {
		transition: none;
	}

	.sidebar-panel-enter-active,
	.sidebar-panel-leave-active {
		transition: none;
	}
}

</style>

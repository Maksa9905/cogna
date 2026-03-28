

<script setup lang="ts">
import PageContainer from "@/widgets/PageContainer";
import { useMediaQuery, useSidebarExpandedStorage } from "@/shared/lib";
import MobileSideBar from "@/widgets/SideBar/MobileSideBar.vue";
import SideBar from "@/widgets/SideBar/SideBar.vue";

defineOptions({
	name: "BaseLayout",
});

const sidebarExpanded = useSidebarExpandedStorage(true);

const isMobileNav = useMediaQuery("(max-width: 575px)");
</script>

<template>
	<div
		class="base-layout"
		:class="{
			'base-layout--sidebar-collapsed': !sidebarExpanded,
			'base-layout--mobile-nav': isMobileNav,
		}"
	>
		<SideBar v-if="!isMobileNav" v-model:expanded="sidebarExpanded" />
		<MobileSideBar v-else />
		<PageContainer>
			<RouterView v-slot="{ Component }">
				<KeepAlive :include="['HomePage', 'SubjectPage']">
					<component :is="Component" />
				</KeepAlive>
			</RouterView>
		</PageContainer>
	</div>
</template>

<style scoped>
.base-layout {
	--sidebar-width: 320px;
}

.base-layout--sidebar-collapsed {
	--sidebar-width: 72px;
}

@media (min-width: 576px) and (max-width: 767px) {
	.base-layout {
		--sidebar-width: 100%;
	}

	.base-layout--sidebar-collapsed {
		--sidebar-width: 72px;
	}
}

@media (min-width: 768px) {
	.base-layout {
		--sidebar-width: 320px;
	}

	.base-layout--sidebar-collapsed {
		--sidebar-width: 72px;
	}
}

@media (max-width: 575px) {
	.base-layout--mobile-nav {
		--sidebar-width: 0px;
	}
}
</style>

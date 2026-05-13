

<script setup lang="ts">
import PageContainer from "@/widgets/PageContainer";
import { useSidebarExpandedStorage } from "@/shared/lib";
import MobileSideBar from "@/widgets/SideBar/MobileSideBar.vue";
import SideBar from "@/widgets/SideBar/SideBar.vue";

defineOptions({
	name: "BaseLayout",
});

const sidebarExpanded = useSidebarExpandedStorage(true);

</script>

<template>
	<div
		class="base-layout"
		:class="{'base-layout--sidebar-collapsed': !sidebarExpanded }"
	>
		<SideBar class="side-bar__desktop" v-model:expanded="sidebarExpanded" />
		<MobileSideBar class="side-bar__mobile" />
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

.side-bar__desktop {
		display: flex
}

.side-bar__mobile {
	display: none;
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

	.side-bar__desktop {
		display: none
	}

	.side-bar__mobile {
		display: flex;
	}
}
</style>

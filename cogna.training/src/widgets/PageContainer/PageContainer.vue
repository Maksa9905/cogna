<script setup lang="ts">
defineOptions({
  name: "PageContainer",
});
</script>

<template>
  <main class="page-container">
    <div class="page-container__content">
      <slot></slot>
    </div>
  </main>
</template>

<style scoped>
.page-container {
  width: calc(100% - var(--sidebar-width));
  margin-left: var(--sidebar-width);
  min-height: 100dvh;
  padding: 32px;

	transition: margin-left 0.35s cubic-bezier(0.4, 0, 0.2, 1);
	box-sizing: border-box;
}

@media screen and (max-width: 575px) {
	.page-container {
		margin-left: 0;
		width: 100%;
		padding: 16px;
		padding-bottom: calc(24px + 56px + env(safe-area-inset-bottom, 0px));
	}
}


@media (min-width: 576px) and (max-width: 767px) {
	.page-container {
    margin-left: 72px;
    width: calc(100% - 72px);
	}
}

@media (prefers-reduced-motion: reduce) {
	.page-container {
		transition: none;
	}
}

.page-container__content {
  max-width: 1500px;

  container-type: inline-size;
  container-name: page-container;
}
</style>
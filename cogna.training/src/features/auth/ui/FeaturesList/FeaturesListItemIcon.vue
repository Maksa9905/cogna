<script setup lang="ts">
import { Badge } from "@/shared/ui";
defineOptions({
	name: "FeaturesListItemIcon",
});
</script>

<template>
  <Badge class="feature-list-badge feature-item-icon" variant='transparent'>
    <slot></slot>
  </Badge>
</template>

<style scoped>
.feature-item-icon {
  grid-row: 1 / 3;
  grid-column: 1;
  width: 36px;
  height: 36px;
  color: var(--color-gray-1);
}

.feature-list-badge {
  color: var(--color-gray-50);
  border-color: var(--color-gray-50);

  &::before {
    background-color: var(--color-gray-50);
  }
}
</style>
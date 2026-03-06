<script setup lang="ts">
import { GoogleIcon, GitHubIcon } from "@/shared/icons";

defineOptions({
	name: "AuthIntergrations",
});
</script>

<template>
  <div class="integrations">
    <UButton size="xl" class="w-full justify-center" variant="outline" color="neutral">
      <GoogleIcon /> Google
    </UButton>
    <UButton size="xl" class="w-full justify-center" variant="outline" color="neutral">
      <GitHubIcon /> GitHub
    </UButton>
  </div>
</template>

<style scoped>
.integrations {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 24px 0;
  gap: 8px;
}
</style>

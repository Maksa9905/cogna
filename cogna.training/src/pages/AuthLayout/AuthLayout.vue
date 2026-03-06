<script setup lang="ts">
import { AuthToggleButton, OnboardingAside } from "@/features/auth";
import { RouterView } from "vue-router";
</script>

<template>
  <main class="auth-layout">
    <OnboardingAside />
    <div class="auth-container">
      <div class="auth-container-content">
        <AuthToggleButton />
        <RouterView />
      </div>
    </div>
  </main>
</template>

<style scoped>
.auth-layout {
  display: flex;
  flex-direction: row;
  background-color: var(--color-gray-1);
  height: 100dvh;
  width: 100vw;
}

.auth-container {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  overflow-y: scroll;
}

.auth-container-content {
  display: flex;
  flex-direction: column;
  width: 420px;
  height: 100%;
  margin: 40px;
}

@media (max-width: 500px) {
  .auth-container {
    display: flex;
    flex-direction: column;
    margin: 20px;
    width: 100%;
  }


  .auth-container-content {
    margin: unset;
    width: 100%;
  }

}
</style>
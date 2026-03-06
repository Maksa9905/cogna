<script setup lang="ts">
import { useLogoutMutation } from "@/entities/user";
import { useSession } from "@/entities/session";
import { routes } from "@/shared/router/routes";
import { useRouter } from "vue-router";

const router = useRouter();
const { clearSession } = useSession();
const { mutateAsync: logout, isPending } = useLogoutMutation();

const handleLogout = async () => {
	try {
		await logout();
	} finally {
		clearSession();
		await router.push(routes.login);
	}
};
</script>

<template>
  <div class="home-page">
    <h1>Добро пожаловать в Cogna!</h1>
    <p>Вы успешно авторизованы</p>
    <UButton :is-loading="isPending" color="primary" @click="handleLogout">Выйти</UButton>
  </div>
</template>

<style scoped>
.home-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100dvh;
  gap: 16px;
}
</style>

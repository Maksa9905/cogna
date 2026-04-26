<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { EUserStatus } from '../../model/types';
import UserAvatar from '../UserAvatar';
import { ExitIcon } from '@/shared/icons';
import { useLogoutMutation } from '../../api/api';
import { useRouter } from 'vue-router';
import { useSession } from '@/entities/session';
import { useLocalizedRouter } from '@/shared/i18n';

defineOptions({
  name: "UserCard",
});

const { t } = useI18n();
const { clearSession } = useSession()
const router = useRouter();
const { routes } = useLocalizedRouter();
const { mutate: mutateLogout } = useLogoutMutation();

const { name, status = EUserStatus.STUDENT, email = 'example@example.com' } = defineProps<{
  name: string;
  status?: string;
  email?: string;
}>();

const logout = () => {
  mutateLogout();
  clearSession();
  router.push(routes.value.login);
}

</script>

<template>
  <div class="user-card">
    <UserAvatar :name="name" />
    <div class="user-card__info">
      <h3 class="user-card__name">{{ name }}</h3>
      <span class="user-card__status">{{ t(`user.status.${status}`) }}</span>
      <p class="user-card__email">{{ email }}</p>
    </div>
    <button type="button" class="user-card__exit" @click="logout">
      <ExitIcon/>
    </button>
  </div>
</template>

<style scoped>
.user-card {
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  gap: 12px;
}

.user-card__info {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto auto auto;
  font-size: 14px;
  column-gap: 8px;
}

.user-card__name {
  font-size: 14px;
  font-weight: 600;
}

.user-card__status {
  font-size: 14px;
  color: var(--text-color-muted);
}

.user-card__email {
  font-size: 14px;
  color: var(--text-color-toned);
  grid-column: 1 / 3;
}

.user-card__exit {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  margin: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: auto;

  color: var(--text-color-toned);

  >svg {
    width: 100%;
    height: 100%;
  }
}
</style>
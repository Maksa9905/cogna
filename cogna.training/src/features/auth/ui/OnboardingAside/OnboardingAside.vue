<script setup lang="ts">
import { Badge, Logotype } from "@/shared/ui";
import { AiIcon, BrainIcon, TrendingIcon, BookIcon } from "@/shared/icons";
import FeaturesList from "../FeaturesList";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
</script>

<template>
  <aside>
    <Logotype badge-class='aside-badge' />
    <div class='aside-content'>
      <Badge class="aside-badge ai-badge" variant="transparent">
        <AiIcon class="ai-icon" />
        {{ t('auth.onboarding.badge') }}
      </Badge>
      <h1 class="title">
        {{ t('auth.onboarding.title') }} <br> <span class="title-highlight">{{ t('auth.onboarding.titleHighlight')
        }}</span>
      </h1>
      <p class="description">
        {{ t('auth.onboarding.description') }}
      </p>
      <FeaturesList>
        <FeaturesList.Item>
          <FeaturesList.Item.Icon>
            <BookIcon class="icon" />
          </FeaturesList.Item.Icon>
          <FeaturesList.Item.Title>{{ t('auth.onboarding.features.smartTickets.title') }}</FeaturesList.Item.Title>
          <FeaturesList.Item.Description>{{ t('auth.onboarding.features.smartTickets.description') }}
          </FeaturesList.Item.Description>
        </FeaturesList.Item>
        <FeaturesList.Item>
          <FeaturesList.Item.Icon>
            <BrainIcon class="icon" />
          </FeaturesList.Item.Icon>
          <FeaturesList.Item.Title>{{ t('auth.onboarding.features.aiCheck.title') }}</FeaturesList.Item.Title>
          <FeaturesList.Item.Description>{{ t('auth.onboarding.features.aiCheck.description') }}
          </FeaturesList.Item.Description>
        </FeaturesList.Item>
        <FeaturesList.Item>
          <FeaturesList.Item.Icon>
            <TrendingIcon class="icon" />
          </FeaturesList.Item.Icon>
          <FeaturesList.Item.Title>{{ t('auth.onboarding.features.spacedRepetition.title') }}</FeaturesList.Item.Title>
          <FeaturesList.Item.Description>{{ t('auth.onboarding.features.spacedRepetition.description') }}
          </FeaturesList.Item.Description>
        </FeaturesList.Item>
      </FeaturesList>
      <Badge class="aside-badge users-rating" variant="transparent">
        <UAvatarGroup class="users-list">
          <UAvatar src="https://github.com/benjamincanac.png" alt="Benjamin Canac" />
          <UAvatar src="https://github.com/romhml.png" alt="Romain Hamel" />
          <UAvatar src="https://github.com/noook.png" alt="Neil Richter" />
          <UAvatar src="https://github.com/noook.png" alt="Neil Richter" />
        </UAvatarGroup>
        <p class="bold">{{ t('auth.onboarding.usersCount', { count: '12 000' }) }}</p>
        <p>{{ t('auth.onboarding.usersDescription') }}</p>
      </Badge>
    </div>
  </aside>
</template>

<style scoped>
aside {
  background: linear-gradient(-45deg, var(--color-purple-500), var(--color-purple-700));
  color: var(--color-gray-100);
  padding: 36px;
  display: flex;
  flex-direction: column;
  max-width: 560px
}

.dark {
  aside {
    background: linear-gradient(-45deg, var(--color-purple-900), var(--color-purple-800))
  }
}

:deep(.aside-badge) {
  color: var(--color-gray-50);
  border-color: var(--color-gray-50);

  &::before {
    background-color: var(--color-gray-50);
  }
}

.aside-content {
  display: flex;
  flex-direction: column;
  gap: 32px;
  justify-content: center;
  flex: 1;
}

.ai-badge {
  width: fit-content;
  height: 32px;
  padding: 2px 12px;
  font-size: 12px;
  border-radius: 32px;
  gap: 4px;
  margin-top: 48px;
}

.ai-icon {
  color: var(--color-gray-1);
  width: 14px;
}

.title {
  font-size: 40px;
  font-weight: 800;
  line-height: 48px;
  color: var(--color-gray-1);
  line-height: 100%;
}

.title-highlight {
  color: var(--color-purple-2);
}

.description {
  line-height: 28px;
  font-size: 16px;
  color: var(--color-purple-2);
}

.icon {
  width: 16px;
  height: 16px;
}

.users-rating {
  padding: 16px;
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto auto;
  column-gap: 20px;

  p {
    font-size: 12px;
  }

  .bold {
    font-weight: 800;
  }
}

.users-list {
  display: flex;
  flex-direction: row;
  grid-row: 1 / 3;
}

@media (max-width: 1024px) {
  aside {
    display: none;
  }
}
</style>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { localizedRoutes } from '@/shared/router/routes';
import type { SupportedLocale } from './i18n';
import { getCurrentLocale, SUPPORTED_LOCALES } from './i18n';

export function useLocalizedRouter() {
  const route = useRoute();
  const router = useRouter();

  const currentLocale = computed(() => 
    (route.params.locale as SupportedLocale) || getCurrentLocale()
  );

  const routes = computed(() => localizedRoutes(currentLocale.value));

  const switchLocale = (newLocale: SupportedLocale) => {
    const currentPath = route.path;
    const pathWithoutLocale = currentPath.replace(/^\/[a-z]{2}(\/|$)/, '/');
    const newPath = `/${newLocale}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`;
    router.push(newPath);
  };

  return {
    currentLocale,
    routes,
    switchLocale,
    availableLocales: SUPPORTED_LOCALES,
  };
}

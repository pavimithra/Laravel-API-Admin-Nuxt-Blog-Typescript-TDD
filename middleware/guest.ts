import { useAuthStore } from "@/stores/auth";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const store = useAuthStore();
  await store.initUser();
  if (store.isAuthenticated) {
    return navigateTo("/admin");
  }
});

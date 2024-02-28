<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";

definePageMeta({
  layout: "auth",
  middleware: ["auth"],
  title: "Logging out of Admin",
});
useHead({
  title: "Logout",
});
const { logout } = useAuthStore();
logout();
await navigateTo("/admin/login", {
  replace: true,
});
</script>

<template>
  <div>Logging Out...</div>
</template>

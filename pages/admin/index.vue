<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";

definePageMeta({
  middleware: ["auth"],
  layout: "admin",
});
useHead({
  title: "Dashboard",
});
const { user } = useAuthStore();
</script>

<template>
  <div><span class="text-1xl font-bold">Admin Id</span> - {{ user!.id }}</div>
  <div>
    <span class="text-1xl font-bold">Admin User</span> - {{ user!.name }}
  </div>
  <div>
    <span class="text-1xl font-bold">Admin Email</span> - {{ user!.email }}
  </div>
</template>

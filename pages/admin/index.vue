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

const loading = ref(true);

setTimeout(() => {
  loading.value = false;
}, 1000);
</script>

<template>
  <div>
    <template v-if="loading">
      <!-- Loading Skeleton -->
      <div
        class="bg-white p-3 ring-1 ring-slate-900/5 rounded-lg shadow-lg max-w-xs w-full"
      >
        <div class="flex space-x-4 animate-pulse">
          <div class="flex-1 space-y-3 py-1">
            <div class="h-6 bg-slate-200 rounded"></div>
            <div class="h-6 bg-slate-200 rounded"></div>
            <div class="h-6 bg-slate-200 rounded"></div>
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <!-- Actual Content -->
      <div>
        <span class="text-1xl font-bold">Admin Id</span> - {{ user!.id }}
      </div>
      <div>
        <span class="text-1xl font-bold">Admin User</span> - {{ user!.name }}
      </div>
      <div>
        <span class="text-1xl font-bold">Admin Email</span> - {{ user!.email }}
      </div>
    </template>
  </div>
</template>

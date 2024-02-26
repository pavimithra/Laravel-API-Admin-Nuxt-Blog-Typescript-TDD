<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
  layout: false,
});
useHead({
  title: "Users",
});
</script>

<template>
  <NuxtLayout name="admin">
    <template #header>Users</template>

    <p>Users Index</p>
  </NuxtLayout>
</template>

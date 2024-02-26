<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
  layout: false,
});
useHead({
  title: "Categories",
});
</script>

<template>
  <NuxtLayout name="admin">
    <template #header>Categories</template>

    <p>Categories Index</p>
  </NuxtLayout>
</template>

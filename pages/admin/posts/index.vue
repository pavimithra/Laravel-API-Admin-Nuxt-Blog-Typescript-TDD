<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
  layout: false,
});
useHead({
  title: "Posts",
});
</script>

<template>
  <NuxtLayout name="admin">
    <template #header>Posts</template>

    <p>Posts Index</p>
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
  layout: "admin",
  title: "Posts",
});
useHead({
  title: "Posts",
});
</script>

<template>
  <p>Posts Index</p>
</template>

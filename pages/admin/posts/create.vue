<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
  layout: "admin",
  title: "Create Post",
});

useHead({
  title: "Create Post",
});
</script>

<template>
  <p>New Post</p>
</template>

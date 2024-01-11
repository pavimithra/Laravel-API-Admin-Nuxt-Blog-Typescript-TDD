<script setup lang="ts">
definePageMeta({
    layout: "auth",
    middleware: ["auth"],
    title: "Logging out of Admin"
});
useHead({
    title: 'Logout',
})
const { logout } = useAuth();
logout();
</script>
<template>
  <div>Logging Out...</div>
</template>
<script setup lang="ts">
definePageMeta({
    middleware: ["auth"],
    layout: "admin"
});
useHead({
    title: 'Dashboard',
})
const { user } = useAuth();
</script>

<template>
    <div><span class=" text-1xl font-bold">Admin Id</span> - {{ user!.id }}</div>
    <div><span class=" text-1xl font-bold">Admin User</span> - {{ user!.name }}</div>
    <div><span class=" text-1xl font-bold">Admin Email</span>  - {{ user!.email }}</div>
</template>
<script setup lang="ts">
definePageMeta({
    middleware: ["auth"],
    layout: false,
});
useHead({
    title: 'Monthly Report',
})
</script>

<template>
    <NuxtLayout name="admin">
        <template #header>Monthly Report</template>

        <p>Monthly Reports Index</p>
    </NuxtLayout>
</template>
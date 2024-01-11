<script setup lang="ts">
definePageMeta({
    middleware: ["auth"],
    layout: false,
});

useHead({
    title: 'Yearly Report',
})
</script>

<template>
    <NuxtLayout name="admin">
        <template #header>Yearly Report</template>

        <p>Yearly Reports Index</p>
    </NuxtLayout>
</template>
<script setup lang="ts">
useHead({
    titleTemplate: (titleChunk) => {
        return titleChunk ? `${titleChunk} - Satvic Recipes Admin` : 'Satvic Recipes Admin';
    }
})
</script>

<template>
    <NuxtLayout>
        <NuxtPage />
    </NuxtLayout>
</template>

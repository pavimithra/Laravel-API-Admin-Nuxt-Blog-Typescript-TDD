<script setup lang="ts">
const route = useRoute();
const title = computed(() =>
  route.meta.title ? `${route.meta.title}` : "Admin"
);
useHead({
  htmlAttrs: {
    class: "h-full bg-gray-50",
  },
  bodyAttrs: {
    class: "h-full",
  },
});
</script>

<template>
  <div
    class="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8"
  >
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <Logo class="mx-auto h-10 w-auto" />
      <h2
        class="mt-3 text-center text-4xl font-extrabold font-dance leading-9 tracking-tight text-gray-900"
      >
        {{ title }}
      </h2>
    </div>

    <div class="mt-5 sm:mx-auto sm:w-full sm:max-w-[480px]">
      <div class="bg-white px-6 py-6 shadow sm:rounded-lg sm:px-12">
        <slot />
      </div>
    </div>
  </div>
</template>

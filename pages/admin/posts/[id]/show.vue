<script setup lang="ts">
import type { Post } from "@/types";
import { usePostStore } from "@/stores/posts";

definePageMeta({
  middleware: ["auth"],
  layout: "admin",
  title: "Show Post",
});

useHead({
  title: "Show Post",
});

const store = usePostStore();

store.isLoading = true;

const route = useRoute();

const { id } = route.params;

const post: Ref<Post | null> = ref(null);

onMounted(async () => {
  post.value = await store.showPost(Number(id));
});

const publishPost = () => {
  store.selectedPosts = [];
  store.selectedPosts.push(Number(id));
  store.performAction("publish");
};
</script>

<template>
  <div>
    <div class="flex gap-2 justify-end">
      <div>
        <NuxtLink to="/admin/posts">
          <FormKit type="button"> Back </FormKit>
        </NuxtLink>
      </div>
    </div>
    <div v-if="store.isLoading">
      <div class="shadow rounded-md p-4 w-full">
        <div class="animate-pulse flex space-x-4">
          <div class="flex-1 space-y-6 py-1">
            <div class="space-y-2">
              <h1 class="h-10 w-full sm:w-1/2 bg-slate-200 rounded"></h1>
              <h3 class="h-5 w-full sm:w-1/2 bg-slate-200 rounded"></h3>
            </div>
            <div class="space-y-3">
              <p class="h-6 bg-slate-200 rounded"></p>
              <p class="h-80 bg-slate-200 rounded"></p>
              <p class="h-10 bg-slate-200 rounded"></p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="max-w-full lg:gap-x-8 -mt-3">
        <div class="flex">
          <h1
            class="text-5xl font-bold font-oswald tracking-tight text-gray-900"
          >
            {{ post?.title }}
          </h1>
          <span
            class="ml-2 h-6 inline-flex items-center rounded-md px-2 py-1 text-xs font-medium font-sans ring-1 ring-inset"
            :class="{
              'bg-green-50 text-green-700 ring-green-600/20':
                post?.status === 'published',
              'bg-yellow-50 text-yellow-700 ring-yellow-600/20':
                post?.status === 'draft',
            }"
          >
            {{ post?.status }}
          </span>
        </div>
        <h3 class="text-xl font-bold font-oswald tracking-tight text-gray-900">
          {{ post?.slug }}{{ post?.category_name }}
        </h3>

        <div class="py-6">
          <!-- Description and details -->
          <div>
            <h3 class="sr-only">Content</h3>

            <div class="space-y-6">
              <p class="text-base text-gray-900" v-html="post?.description"></p>
              <p class="text-base text-gray-900">
                <img :src="post?.image" alt="" />
              </p>
              <p class="text-base text-gray-900" v-html="post?.content"></p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex gap-2 justify-start">
      <div>
        <NuxtLink to="/admin/posts">
          <button
            type="button"
            @click="publishPost"
            class="block uppercase rounded-md bg-green-600 px-4 py-2 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Publish Post
          </button>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

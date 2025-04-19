<script setup lang="ts">
import { usePostStore } from "@/stores/posts";
// @ts-ignore
import { TailwindPagination } from "laravel-vue-pagination";
import {
  PencilSquareIcon,
  ArrowRightCircleIcon,
  TrashIcon,
} from "@heroicons/vue/24/outline";

const store = usePostStore();

const props = defineProps<{
  searchData: {
    rowsPerPage: number;
    searchName: string;
    searchStatus: string;
  };
}>();

const indeterminate = computed(
  () =>
    store.selectedPosts.length > 0 &&
    store.selectedPosts.length < (store.posts?.data?.length ?? 0)
);

const handleCheckboxChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const postData = store.posts?.data;
  if (postData) {
    store.selectedPosts = target.checked ? postData.map((post) => post.id) : [];
  }
};

async function deletePost(postId: number) {
  try {
    await store.deletePost(postId);
    alert("Post Deleted Succesfully");
  } catch (err) {
    console.log("error");
  }
}
</script>

<template>
  <div class="relative">
    <div
      v-if="store.selectedPosts.length > 0"
      class="absolute left-14 top-0 flex h-12 items-center space-x-3 sm:left-12"
    >
      <button
        type="button"
        @click="store.performAction('publish')"
        data-testId="publish-all"
        class="inline-flex items-center rounded bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
      >
        Publish all
      </button>
      <button
        type="button"
        @click="store.performAction('delete')"
        data-testId="deletes-all"
        class="inline-flex items-center rounded bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
      >
        Delete all
      </button>
    </div>
    <table
      class="min-w-full table-fixed divide-y divide-gray-300 border border-gray-200 shadow-md"
    >
      <thead class="bg-gray-200">
        <tr>
          <th scope="col" class="relative px-7 sm:w-12 sm:px-6">
            <input
              v-if="
                store.isLoading ||
                (store.posts?.data && store.posts.data.length === 0)
              "
              type="checkbox"
              disabled
              class="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-600"
            />
            <input
              v-else-if="store.posts?.data && store.posts.data.length > 0"
              type="checkbox"
              data-testId="checkbox-all"
              class="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-600"
              :checked="
                indeterminate ||
                store.selectedPosts.length === store.posts?.data?.length
              "
              :indeterminate="indeterminate"
              @change="handleCheckboxChange"
            />
          </th>
          <th
            scope="col"
            class="min-w-[12rem] py-3.5 pr-3 text-left text-sm font-semibold text-gray-900"
          >
            Title
          </th>
          <th
            scope="col"
            class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 text-wrap"
          >
            Category
          </th>

          <th
            scope="col"
            class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
          >
            Status
          </th>
          <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-3">
            <span class="sr-only">Edit</span>
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200 bg-white">
        <tr
          v-for="post in store.posts?.data"
          :key="post.slug"
          :class="[store.selectedPosts.includes(post.id) && 'bg-gray-50']"
          v-if="!store.isLoading"
        >
          <td class="relative px-7 sm:w-12 sm:px-6">
            <div
              v-if="store.selectedPosts.includes(post.id)"
              class="absolute inset-y-0 left-0 w-0.5 bg-green-700"
            ></div>
            <input
              type="checkbox"
              :data-testId="'checkbox-' + post.id"
              class="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-600"
              :value="post.id"
              v-model="store.selectedPosts"
            />
          </td>
          <td
            :class="[
              'py-4 pr-3 text-sm font-medium',
              store.selectedPosts.includes(post.id)
                ? 'text-indigo-600'
                : 'text-gray-900',
            ]"
          >
            <div class="flex items-center">
              <div class="h-10 w-10 flex-shrink-0">
                <img class="h-10 w-10 rounded-full" :src="post.image" alt="" />
              </div>
              <div class="ml-2">
                <div class="font-medium text-gray-900">
                  {{ post.title }}
                </div>
                <div class="mt-1 text-gray-500">{{ post.slug }}</div>
              </div>
            </div>
          </td>
          <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
            {{ post.category_name }}
          </td>
          <td class="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
            <span
              class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset"
              :class="{
                'bg-green-50 text-green-700 ring-green-600/20':
                  post.status === 'published',
                'bg-yellow-50 text-yellow-700 ring-yellow-600/20':
                  post.status === 'draft',
              }"
            >
              {{ post.status }}
            </span>
          </td>
          <td
            class="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3"
          >
            <div class="flex gap-3">
              <NuxtLink :to="'/admin/posts/' + post.id + '/show'">
                <ArrowRightCircleIcon
                  class="h-6 w-6 text-gray-700"
                  aria-hidden="true"
                />
              </NuxtLink>
              <NuxtLink :to="'/admin/posts/' + post.id + '/edit'">
                <PencilSquareIcon
                  class="h-6 w-6 text-gray-700"
                  aria-hidden="true"
                />
              </NuxtLink>
              <a href="#" @click="deletePost(post.id)">
                <TrashIcon class="h-6 w-6 text-gray-700" aria-hidden="true" />
              </a>
            </div>
          </td>
        </tr>
        <tr v-else class="text-center font-bold">
          <td
            colspan="5"
            class="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
          >
            <span class="inline-flex items-center font-semibold leading-6">
              Loading...
            </span>
          </td>
        </tr>
        <tr
          v-if="
            !store.isLoading &&
            store.posts?.data &&
            store.posts.data.length === 0
          "
          class="text-center font-bold"
        >
          <td colspan="5" class="py-4 text-gray-500">No posts Found</td>
        </tr>
        <tr
          v-if="
            store.posts?.meta &&
            !store.isLoading &&
            store.posts.data &&
            store.posts.data.length > 0
          "
          class="text-center font-bold"
        >
          <td
            colspan="2"
            class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-left"
          >
            Page <b>{{ store.posts.meta.current_page }}</b> of
            <b>{{ store.posts.meta.last_page }}</b>
          </td>
          <td
            colspan="3"
            class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-right"
          >
            <TailwindPagination
              :data="store.posts"
              @pagination-change-page="
                        (page: number) => store.fetchPosts(page, props.searchData)
                      "
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { usePostStore } from "@/stores/posts";
import debounce from "lodash/debounce";

definePageMeta({
  middleware: ["auth"],
  layout: "admin",
  title: "Posts",
});

useHead({
  title: "Posts",
});

const store = usePostStore();

const searchData = reactive({
  rowsPerPage: ref(5),
  searchName: ref(""),
  searchStatus: ref(""),
});

onMounted(async () => {
  await store.fetchPosts(1, searchData);
});

const debouncedSearch = debounce(() => {
  store.fetchPosts(1, searchData);
}, 300);

watch(searchData, debouncedSearch, { deep: true });
</script>

<template>
  <div class="px-4">
    <div class="md:flex md:items-center">
      <div class="flex flex-grow">
        <NuxtLink to="/admin/posts/create">
          <button
            type="button"
            class="block uppercase rounded-md bg-green-600 px-4 py-2 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Create Post
          </button>
        </NuxtLink>
      </div>
      <div class="mt-2 md:ml-5 lg:ml-16 md:mt-0 md:flex">
        <input
          type="text"
          name="name"
          id="name"
          data-testId="search-name"
          v-model="searchData.searchName"
          class="border border-zinc-500 rounded-lg mt-0 md:mt-2 lg:mt-0 text-base text-zinc-700 placeholder:text-zinc-400 bg-white focus-within:ring-1 focus-within:!ring-green-500 focus-within:!border-green-500"
          placeholder="Search By Name"
        />
        <div class="md:ml-4 mt-2 lg:mt-0">
          <label>
            <select
              id="searchStatus"
              data-testId="search-status"
              v-model="searchData.searchStatus"
              class="border border-zinc-500 rounded-lg text-base text-zinc-700 bg-white focus-within:ring-1 focus-within:!ring-green-500 focus-within:!border-green-500"
            >
              <option value="">Search Status</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </label>
        </div>
        <div class="md:ml-4 mt-2 lg:mt-0">
          <label>
            <select
              data-testId="rows-per-page"
              id="rowsPerPage"
              v-model="searchData.rowsPerPage"
              class="border border-zinc-500 rounded-lg text-base text-zinc-700 bg-white focus-within:ring-1 focus-within:!ring-green-500 focus-within:!border-green-500"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
              <option value="25">25</option>
            </select>
          </label>
        </div>
      </div>
    </div>

    <div class="mt-8 flow-root">
      <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <AdminPostsDataTable :searchData="searchData" />
        </div>
      </div>
    </div>
  </div>
</template>

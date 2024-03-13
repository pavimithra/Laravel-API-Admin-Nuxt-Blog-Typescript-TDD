import { defineStore } from "pinia";
import axios from "axios";
import type { PostWithPagination, postSearchData } from "@/types";

export const usePostStore = defineStore("post", () => {
  const posts: Ref<PostWithPagination | null> = ref(null);
  const selectedPosts: Ref<number[]> = ref([]);
  const isLoading: Ref<boolean> = ref(false);

  async function fetchPosts(
    page = 1,
    searchData: postSearchData
  ): Promise<void> {
    const { rowsPerPage, searchName, searchStatus } = searchData;

    isLoading.value = true; // Set loading state to true

    try {
      const response = await axios.get(`/posts?page=${page}`, {
        params: {
          rows_per_page: rowsPerPage,
          search_name: searchName,
          search_status: searchStatus,
        },
      });
      posts.value = response.data;
      selectedPosts.value = []; // Reset selectedPosts
    } finally {
      isLoading.value = false; // Set loading state to false after fetching
    }
  }

  return {
    posts: posts as ComputedRef<PostWithPagination | null>,
    selectedPosts,
    isLoading,
    fetchPosts,
  };
});

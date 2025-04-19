import { defineStore } from "pinia";
import axios from "axios";
import type {
  PostWithPagination,
  postSearchData,
  PostPayload,
  Post,
  Categories,
} from "@/types";

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

  async function storePost(postData: PostPayload): Promise<void> {
    const formData = new FormData();
    formData.append("title", postData.title);
    formData.append("slug", postData.slug);
    formData.append("description", postData.description);
    formData.append("content", postData.content);
    formData.append("category_id", postData.category_id);
    if (postData.image && postData.image.length > 0) {
      formData.append("image", postData.image[0].file);
    }

    await axios.post("/posts", formData, {
      headers: {
        "Content-Type": "multipart/form-data", // Ensures proper content type for FormData
      },
    });
  }

  async function showPost(postID: number): Promise<Post | null> {
    isLoading.value = true;
    try {
      const response = await axios.get(`/posts/${postID}`);
      return response.data as Post;
    } catch (error) {
      return null;
    } finally {
      isLoading.value = false; // Set loading state to false after fetching
    }
  }

  async function updatePost(
    postId: number,
    postData: PostPayload
  ): Promise<void> {
    const formData = new FormData();
    formData.append("_method", "PUT");
    formData.append("title", postData.title);
    formData.append("slug", postData.slug);
    formData.append("content", postData.content);
    formData.append("description", postData.description);
    formData.append("category_id", postData.category_id);
    const headers: Record<string, string> = {};
    if (postData.image && postData.image.length > 0) {
      formData.append("image", postData.image[0].file);
      headers["Content-Type"] = "multipart/form-data"; // Set content type only if image exists
    }
    await axios.post(`/posts/${postId}`, formData, {
      headers: headers, // Pass headers to the request
    });
  }

  async function deletePost(postId: number): Promise<void> {
    try {
      await axios.delete(`/posts/${postId}`);
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  }

  async function fetchCategories(): Promise<Categories | null> {
    isLoading.value = true;
    try {
      const response = await axios.get("/posts/getCategories");
      return response.data as Categories;
    } catch (error) {
      return null;
    } finally {
      isLoading.value = false; // Set loading state to false after fetching
    }
  }

  async function performAction(actionType: string) {
    isLoading.value = true;
    try {
      const response = await axios.post("/posts/performAction", {
        actionType,
        selectedPosts: selectedPosts.value,
      });
      selectedPosts.value = [];
      await fetchPosts(1, {
        rowsPerPage: 5,
        searchName: "",
        searchStatus: "",
      });
      alert(response.data.message);
    } catch (error) {
      console.error("Error performing operation:", error);
    } finally {
      isLoading.value = false; // Set loading state to false after fetching
    }
  }

  return {
    posts: posts as ComputedRef<PostWithPagination | null>,
    selectedPosts,
    isLoading,
    fetchPosts,
    storePost,
    showPost,
    updatePost,
    deletePost,
    fetchCategories,
    performAction,
  };
});

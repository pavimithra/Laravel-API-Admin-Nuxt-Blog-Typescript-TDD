// stores/posts.spec.js
import { describe, it, expect, afterEach, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { usePostStore } from "@/stores/posts";
import { vi } from "vitest";
import axios from "axios";

describe("Post Store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("fetches posts correctly", async () => {
    const store = usePostStore();

    const searchData = reactive({
      rowsPerPage: ref(5),
      searchName: ref(""),
      searchStatus: ref(""),
    });

    const postsData = [
      {
        id: 1,
        title: "Post 1",
        slug: "post-1",
        content: "Post 1 Content",
        image: "image1.jpg",
        status: "draft",
      },
      {
        id: 2,
        title: "Post 2",
        slug: "post-2",
        content: "Post 2 Content",
        image: "image2.jpg",
        status: "draft",
      },
    ];
    const axiosFetch = vi
      .spyOn(axios, "get")
      .mockResolvedValueOnce({ data: postsData });

    await store.fetchPosts(1, searchData);
    expect(axiosFetch).toHaveBeenCalledWith("/posts?page=1", {
      params: {
        rows_per_page: searchData.rowsPerPage,
        search_name: searchData.searchName,
        search_status: searchData.searchStatus,
      },
    });

    expect(store.posts).toEqual(postsData);
    expect(store.selectedPosts).toEqual([]);
    expect(store.isLoading).toBe(false);

    axiosFetch.mockRestore();
  });
});

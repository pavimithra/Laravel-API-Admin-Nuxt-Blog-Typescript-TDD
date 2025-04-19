// @vitest-environment nuxt
import { describe, it, expect, vi } from "vitest";
import { createTestingPinia } from "@pinia/testing";
import { mount, flushPromises } from "@vue/test-utils";
import { usePostStore } from "@/stores/posts";
import PostCreate from "../admin/posts/create.vue";
import formKitConfig from "@/formkit.config";

describe("YourComponent", () => {
  it("sets the value of post correctly", async () => {
    const mockPost = {
      id: 1,
      title: "Test Post",
      slug: "test-post",
      category_id: 1,
      description: "Description of the test post",
      content: "Content of the test post",
      image: "path/to/image.jpg",
      // Add other properties as needed
    };

    // Mock the $route object to provide necessary parameters
    const $route = {
      params: {
        id: mockPost.id, // Assuming you want to use the id from the mockPost
      },
    };

    const store = {
      showPost: vi.fn().mockResolvedValue(mockPost),
      fetchCategories: vi.fn().mockResolvedValue({}),
      isLoading: true,
    };

    const wrapper = mount(PostCreate, {
      global: {
        mocks: {
          $route,
          $store: store,
        },
        plugins: [createTestingPinia(), formKitConfig],
      },
    });

    // Wait for the component to update after fetching the post
    await wrapper.vm.$nextTick();

    console.log(wrapper.html());

    // Assert that the value of post is set correctly
    //expect(wrapper.vm.post).toEqual(mockPost);
  });
});

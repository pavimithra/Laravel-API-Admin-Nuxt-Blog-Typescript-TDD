// @vitest-environment nuxt
import { describe, it, expect, vi } from "vitest";
import { createTestingPinia } from "@pinia/testing";
import { mount, flushPromises } from "@vue/test-utils";
import { usePostStore } from "@/stores/posts";
import PostCreate from "../admin/posts/create.vue";
import formKitConfig from "@/formkit.config";

describe("CreatePost Page", async () => {
  const wrapper = mount(PostCreate, {
    global: {
      plugins: [createTestingPinia(), formKitConfig],
    },
  });

  await flushPromises();

  const store = usePostStore();
  // Mock the categoryImagePreview method
  vi.spyOn(wrapper.vm as any, "postImagePreview");

  store.isLoading = false;

  it("renders form elements correctly", async () => {
    //console.log(wrapper.html());
    expect(wrapper.find('[data-testId="createPost"]').exists()).toBe(true);
    expect(wrapper.find('[data-testId="post-title"]').exists()).toBe(true);
    expect(wrapper.find('[data-testId="post-slug"]').exists()).toBe(true);
    expect(wrapper.find('[data-testId="category_id"]').exists()).toBe(true);
    expect(wrapper.find('[data-testId="post-description"]').exists()).toBe(
      true
    );
    expect(wrapper.find('[data-testId="post-image"]').exists()).toBe(true);
    expect(wrapper.find('[data-testId="post-content"]').exists()).toBe(true);
    expect(wrapper.find('[data-testId="post-cancel"]').exists()).toBe(true);
    expect(wrapper.find('[data-testId="post-submit"]').exists()).toBe(true);
  });

  it("renders form elements correctly", async () => {
    const postImageChange = wrapper.find("input[data-testId=post-image]");
    const file = new File(["mockImage"], "mockImage.jpg", {
      type: "image/jpeg",
    });

    expect(postImageChange.exists()).toBe(true);

    // Create a new FileList object containing the mock File
    // Create a new FileList object containing the mock File
    const fileList = {
      0: file,
      length: 1,
      item: function (index: number) {
        return index === 0 ? file : null;
      },
    };

    // Mock the change event and pass the FileList object
    postImageChange.element.files = fileList;
    await postImageChange.trigger("change");
    // Ensure that the categoryImagePreview method was called
    expect((wrapper.vm as any).postImagePreview).toHaveBeenCalled();
    await wrapper.vm.$nextTick();

    expect(postImageChange.element.files).toEqual(fileList);
  });
});

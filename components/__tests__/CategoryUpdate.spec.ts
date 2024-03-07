import { describe, test, expect, vi } from "vitest";
import { createTestingPinia } from "@pinia/testing";
import { mount, flushPromises } from "@vue/test-utils";
import { useCategoryStore } from "@/stores/categories";
import CategoryUpdate from "../admin/CategoryUpdate.vue";
import formKitConfig from "@/formkit.config";

describe("Category Item Component", async () => {
  const wrapper = mount(CategoryUpdate, {
    global: {
      plugins: [
        createTestingPinia({
          initialState: {
            category: {
              selectedCategory: {
                id: 2,
                name: "Category 2",
                slug: "category-2",
                image: "image2.jpg",
              },
            },
          },
        }),
        formKitConfig,
      ],
    },
  });

  await flushPromises();

  const store = useCategoryStore();

  // Mock the categoryImagePreview method
  vi.spyOn(wrapper.vm as any, "categoryImagePreview");

  test("category update form is displayed with the selected category data correctly", async () => {
    await flushPromises();

    const categoryName = wrapper.find("input[data-testId=category-name]");

    // Assert that the categoryName exists
    expect(categoryName.exists()).toBe(true);
    expect((categoryName.element as HTMLInputElement).value).toBe(
      store.selectedCategory?.name
    );

    const categorySlug = wrapper.find("input[data-testId=category-slug]");

    // Assert that the categorySlug exists
    expect(categorySlug.exists()).toBe(true);
    expect((categorySlug.element as HTMLInputElement).value).toBe(
      store.selectedCategory?.slug
    );

    const categoryImage = wrapper.find("input[data-testId=category-image]");

    // Assert that the categoryImage exists
    expect(categoryImage.exists()).toBe(true);

    const previewImg = wrapper.find('[data-testId="category-preview"]');
    expect(previewImg.exists()).toBe(true);

    const categoryImageChange = wrapper.find(
      "input[data-testId=category-image]"
    );
    const file = new File(["mockImage"], "mockImage.jpg", {
      type: "image/jpeg",
    });

    expect(categoryImageChange.exists()).toBe(true);

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
    categoryImageChange.element.files = fileList;
    await categoryImageChange.trigger("change");
    // Ensure that the categoryImagePreview method was called
    expect((wrapper.vm as any).categoryImagePreview).toHaveBeenCalled();
    await wrapper.vm.$nextTick();

    expect(categoryImageChange.element.files).toEqual(fileList);

    const previewImgChange = wrapper.find('[data-testId="category-preview"]');
    expect(previewImgChange.exists()).toBe(true);

    // Debugging statement
    //console.log(wrapper.html());
  });

  test("category update form buttons work correctly", async () => {
    await flushPromises();

    const cancelButton = wrapper.find('[data-testId="cancel-button"]');
    // Assert that the cancelButton exists
    expect(cancelButton.exists()).toBe(true);

    await cancelButton.trigger("click");
    // Assert that the component emitted the "update-category" event
    expect(wrapper.emitted()).toHaveProperty("close");

    // trigger the element
    const updateButton = wrapper.find('[data-testId="update-button"]');

    // Assert that the cancelButton exists
    expect(updateButton.exists()).toBe(true);

    await updateButton.trigger("click");

    // Wait for the next tick to allow for asynchronous updateCategory function call
    await wrapper.vm.$nextTick();

    // Ensure that the component emitted the "close" event after updating category
    expect(wrapper.emitted()).toHaveProperty("close");
  });
});

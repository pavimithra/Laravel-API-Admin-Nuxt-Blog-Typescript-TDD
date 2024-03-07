import { describe, test, expect, vi } from "vitest";
import { createTestingPinia } from "@pinia/testing";
import { mount, flushPromises } from "@vue/test-utils";
import CategoryItem from "../admin/CategoryItem.vue";
import formKitConfig from "@/formkit.config";
 
describe("Category Item Component", () => {
  const wrapper = mount(CategoryItem, {
    global: {
      plugins: [createTestingPinia(), formKitConfig],
    },
    props: {
      category: {
        id: 1,
        name: "Category 1",
        slug: "category-1",
        image: "image.jpg",
      },
      categoryIndex: 0,
    },
  });

  const store = useCategoryStore();

  test("can display category items from props correctly", async () => {
    await flushPromises();

    // Assert the src category name
    expect(wrapper.get('[data-testId="category-name"]').text()).toBe(
      "Category 1"
    );

    // Assert the src category slug
    expect(wrapper.get('[data-testId="category-slug"]').text()).toBe(
      "category-1"
    );

    // Assert the src attribute of the img element
    expect(
      wrapper.find('[data-testId="category-image"]').attributes("src")
    ).toBe("image.jpg");
  });

  test("displays the update and delete formkit button and emits an emit @update", async () => {
    await flushPromises();

    const updateButton = wrapper.find('[data-testId="update-category"]');
    // Assert that the updateButton exists
    expect(updateButton.exists()).toBe(true);

    await updateButton.trigger("click");
    // Assert that the component emitted the "update-category" event
    expect(wrapper.emitted("update-category")).toBeTruthy();
    expect(wrapper.emitted()).toHaveProperty("update-category");

    // Assert that the emitted event has the correct arguments
    expect(wrapper.emitted("update-category")?.[0]).toEqual([
      {
        id: 1,
        name: "Category 1",
        slug: "category-1",
        image: "image.jpg",
      }, // category
      0, // categoryIndex
    ]);

    const deleteButton = wrapper.find('[data-testId="delete-category"]');

    // Assert that the deleteButton exists
    expect(deleteButton.exists()).toBe(true);

    // Trigger a click event on the deleteButton
    await deleteButton.trigger("click");

    // Assert that the deleteCategory function is called when the delete button is clicked
    expect(store.deleteCategory).toHaveBeenCalledWith(1);
  });

  test("sets dataTransfer attributes when dragstart event is triggered", async () => {
    await flushPromises();
    const dragStartStop = wrapper.find('[data-testId="drag-startStop"]');

    // Assert that the deleteButton exists
    expect(dragStartStop.exists()).toBe(true);
    const mockEvent = {
      dataTransfer: {
        effectAllowed: "",
        dropEffect: "",
        setData: vi.fn(),
      },
    };

    const component = wrapper.vm as any; // Use any if necessary
    component.handleDragStart(mockEvent, 0);

    expect(mockEvent.dataTransfer.effectAllowed).toBe("move");
    expect(mockEvent.dataTransfer.dropEffect).toBe("move");
    expect(mockEvent.dataTransfer.setData).toHaveBeenCalledWith(
      "from-category-index",
      0
    );
  });

  test("calls moveSelectedCategory function when drop event is triggered", async () => {
    await flushPromises();
    const dragStartStop = wrapper.find('[data-testId="drag-startStop"]');

    // Assert that the deleteButton exists
    expect(dragStartStop.exists()).toBe(true);
    // Create a mock event object
    const mockEvent = {
      dataTransfer: {
        getData: vi.fn().mockReturnValue(1),
      },
    };

    const component = wrapper.vm as any; // Use any if necessary
    component.handleDrop(mockEvent, 0);

    // Expect moveSelectedCategory to be called with correct arguments
    expect(store.moveSelectedCategory).toHaveBeenCalledWith(1, 0);
  });
});

// @vitest-environment nuxt
import { describe, it, expect, vi } from "vitest";
import { createTestingPinia } from "@pinia/testing";
import { mount, flushPromises } from "@vue/test-utils";
import { useCategoryStore } from "@/stores/categories";
import CategoryIndex from "../admin/categories/index.vue";
import formKitConfig from "@/formkit.config";

describe("Category CRUD", async () => {
  const wrapper = mount(CategoryIndex, {
    global: {
      plugins: [createTestingPinia(), formKitConfig],
    },
  });

  await flushPromises();

  const store = useCategoryStore();
  it("renders the page correctly", () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("calls fetchCategories on mount", () => {
    expect(store.fetchCategories).toHaveBeenCalledTimes(1);
  });
});

// stores/categories.spec.js
import { describe, it, expect } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useCategoryStore } from "@/stores/categories";
import { vi } from "vitest";
import axios from "axios";

describe("Category Store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("fetches categories correctly", async () => {
    const categoryStore = useCategoryStore();

    const categoriesData = [
      { id: 1, name: "Category 1", slug: "category-1", image: "image1.jpg" },
      { id: 2, name: "Category 2", slug: "category-2", image: "image2.jpg" },
    ];
    vi.spyOn(axios, "get").mockResolvedValueOnce({ data: categoriesData });

    await categoryStore.fetchCategories();
    expect(categoryStore.categories).toEqual(categoriesData);
  });

  it("creates category correctly", async () => {
    const categoryStore = useCategoryStore();
    const categoryData = {
      name: "New Category",
      slug: "new-category",
      image: [{ file: "image_data" }],
    };
    const response = { id: 3, ...categoryData };

    vi.spyOn(axios, "post").mockResolvedValueOnce({ data: response });

    await categoryStore.createCategory(categoryData);

    expect(categoryStore.categories).toContainEqual(response);
    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith(
      "/categories",
      expect.any(FormData), // Compare FormData objects using any()
      expect.objectContaining({
        // Compare headers object
        headers: expect.objectContaining({
          "Content-Type": "multipart/form-data",
        }),
      })
    );
    expect(categoryStore.categories.length).toBe(1);
  });

  it("handles error when creating a category", async () => {
    const categoryStore = useCategoryStore();

    const categoryData = {
      name: "Test Category",
      slug: "test-category",
      image: [{ file: "test-image" }],
    };

    const errorMessage = "Error creating category";
    vi.spyOn(axios, "post").mockRejectedValueOnce(new Error(errorMessage));

    await expect(categoryStore.createCategory(categoryData)).rejects.toThrow(
      errorMessage
    );

    expect(categoryStore.categories.length).toBe(0); // No category should be added if an error occurs
  });

  it("updates category correctly", async () => {
    const categoryStore = useCategoryStore();

    categoryStore.categories = [
      { id: 1, name: "Category 1", slug: "category-1" },
      { id: 2, name: "Category 2", slug: "category-2" },
    ];

    const categoryData = { name: "Updated Category", slug: "updated-category" };
    const response = { id: 2, ...categoryData };

    categoryStore.selectedCategory = {
      id: 2,
      name: "Category 2",
      slug: "category-2",
    };

    vi.spyOn(axios, "post").mockResolvedValue({ data: response });

    await categoryStore.updateCategory(categoryData);

    expect(categoryStore.categories.find((cat) => cat.id === 2)).toEqual(
      response
    );
  });

  it("handles error when creating a category", async () => {
    const categoryStore = useCategoryStore();

    categoryStore.categories = [
      { id: 1, name: "Category 1", slug: "category-1" },
      { id: 2, name: "Category 2", slug: "category-2" },
    ];

    const categoryData = { name: "Test Category", slug: "test-category" };

    categoryStore.selectedCategory = {
      id: 2,
      name: "Category 2",
      slug: "category-2",
    };

    const errorMessage = "Error creating category";
    vi.spyOn(axios, "post").mockRejectedValueOnce(new Error(errorMessage));

    await expect(categoryStore.updateCategory(categoryData)).rejects.toThrow(
      errorMessage
    );

    expect(categoryStore.categories.find((cat) => cat.id === 2)).toEqual(
      categoryStore.selectedCategory
    ); // category should not be updated if an error occurs
  });

  it("deletes category correctly", async () => {
    const categoryStore = useCategoryStore();
    const categoryId = 1;
    const initialCategories = [
      { id: 1, name: "Category 1" },
      { id: 2, name: "Category 2" },
    ];
    categoryStore.categories = initialCategories;

    vi.spyOn(axios, "delete").mockResolvedValue();

    await categoryStore.deleteCategory(categoryId);

    expect(categoryStore.categories).not.toContainEqual(
      expect.objectContaining({ id: categoryId })
    );
  });

  it("should move the category from one index to another and make axios request", () => {
    const categoryStore = useCategoryStore();

    categoryStore.categories = [{ id: 1 }, { id: 2 }, { id: 3 }];

    const fromIndex = 0;
    const toIndex = 2;

    vi.spyOn(axios, "put").mockResolvedValueOnce();

    // Call the function
    categoryStore.moveSelectedCategory(fromIndex, toIndex);

    // Assertions
    expect(categoryStore.categories).toEqual([{ id: 2 }, { id: 3 }, { id: 1 }]);
    expect(axios.put).toHaveBeenCalledWith("/categories/reOrder", {
      moves: [
        { id: 2, order: 1 },
        { id: 3, order: 2 },
        { id: 1, order: 3 },
      ],
    });
  });
});

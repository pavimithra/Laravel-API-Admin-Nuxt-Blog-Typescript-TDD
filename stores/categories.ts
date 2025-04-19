import { defineStore } from "pinia";
import axios from "axios";
import type { Category, CategoryPayload } from "@/types";

export const useCategoryStore = defineStore("category", () => {
  const categories: Ref<Category[]> = ref([]);
  const selectedCategory: Ref<Category | null> = ref(null);
  const selectedCategoryIndex: Ref<number | null> = ref(null);

  async function fetchCategories(): Promise<void> {
    const response = await axios.get("/categories");
    categories.value = response.data;
  }

  async function createCategory(categoryData: CategoryPayload): Promise<void> {
    const formData = new FormData();
    formData.append("name", categoryData.name);
    formData.append("slug", categoryData.slug);
    formData.append("order", String(categories.value.length + 1));
    if (categoryData.image && categoryData.image.length > 0) {
      formData.append("image", categoryData.image[0].file);
    }

    const response = await axios.post("/categories", formData, {
      headers: {
        "Content-Type": "multipart/form-data", // Ensures proper content type for FormData
      },
    });
    if (response && response.data) {
      categories.value.push(response.data);
    }
  }

  async function updateCategory(categoryData: CategoryPayload): Promise<void> {
    if (selectedCategory.value) {
      const formData = new FormData();
      formData.append("_method", "PUT");
      formData.append("name", categoryData.name);
      formData.append("slug", categoryData.slug);
      const headers: Record<string, string> = {};
      if (categoryData.image && categoryData.image.length > 0) {
        formData.append("image", categoryData.image[0].file);
        headers["Content-Type"] = "multipart/form-data"; // Set content type only if image exists
      }
      const response = await axios.post(
        `/categories/${selectedCategory.value.id}`,
        formData,
        {
          headers: headers, // Pass headers to the request
        }
      );
      const index = categories.value.findIndex(
        (category) => category.id === selectedCategory.value?.id
      );
      if (index !== -1) {
        categories.value[index] = response.data;
      }
    }
  }

  async function deleteCategory(categoryId: number): Promise<void> {
    try {
      await axios.delete(`/categories/${categoryId}`);
      categories.value = categories.value.filter(
        (category) => category.id !== categoryId
      );
    } catch (error) {
      console.error("Error deleting category:", error);
      // Handle error as needed
    }
  }

  function selectCategory(category: Category, categoryIndex: number): void {
    selectedCategory.value = category;
    selectedCategoryIndex.value = categoryIndex;
  }

  function clearSelectedCategory(): void {
    selectedCategory.value = null;
    selectedCategoryIndex.value = null;
  }

  function moveSelectedCategory(
    fromCategoryIndex: number,
    toCategoryIndex: number
  ) {
    // Check if indices are valid
    if (
      fromCategoryIndex < 0 ||
      fromCategoryIndex >= categories.value.length ||
      toCategoryIndex < 0 ||
      toCategoryIndex >= categories.value.length
    ) {
      console.error("Invalid category indices");
      return;
    }

    // Remove category from fromCategoryIndex and insert at toCategoryIndex
    const category = categories.value.splice(fromCategoryIndex, 1)[0];
    categories.value.splice(toCategoryIndex, 0, category);

    // Create categoryMoves array for the moved categories only
    const categoryMoves = [];
    if (fromCategoryIndex < toCategoryIndex) {
      for (let i = fromCategoryIndex; i <= toCategoryIndex; i++) {
        categoryMoves.push({
          id: categories.value[i].id,
          order: Number(i) + 1, // Ensures `i` is treated as a number
        });
      }
    } else {
      for (let i = toCategoryIndex; i <= fromCategoryIndex; i++) {
        categoryMoves.push({
          id: categories.value[i].id,
          order: Number(i) + 1, // Ensures `i` is treated as a number
        });
      }
    }

    axios.put(`/categories/reOrder`, { moves: categoryMoves });
  }

  return {
    categories: categories as ComputedRef<Category[]>,
    selectedCategory,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    selectCategory,
    clearSelectedCategory,
    moveSelectedCategory,
  };
});

<script setup lang="ts">
import { useCategoryStore } from "@/stores/categories";
import { reset } from "@formkit/core";
import type { FormKitNode } from "@formkit/core";
import type { Category, CategoryPayload } from "@/types";
import { UserCircleIcon } from "@heroicons/vue/20/solid";

definePageMeta({
  middleware: ["auth"],
  layout: "admin",
  title: "Categories",
});
useHead({
  title: "Categories",
});

const loading = ref(true);

const store = useCategoryStore();

await store.fetchCategories();

function clearForm() {
  reset("storeCategory");
  categoryPreview.value = "";
}

async function createCategory(payload: CategoryPayload, node?: FormKitNode) {
  try {
    await store.createCategory(payload);
    reset("storeCategory");
    categoryPreview.value = "";
  } catch (err) {
    handleValidationErrors(err, node);
  }
}

const categoryPreview = ref("");

function categoryImagePreview(event: Event): void {
  const inputElement = event.target as HTMLInputElement;
  if (inputElement.files && inputElement.files.length > 0) {
    const file = inputElement.files[0];
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      if (e.target && typeof e.target.result === "string") {
        categoryPreview.value = e.target.result;
      }
    };
    reader.readAsDataURL(file);
  }
}

const showUpdateCategory = ref(false);

const updateCategory = (category: Category, categoryIndex: number) => {
  showUpdateCategory.value = true;
  store.selectCategory(category, categoryIndex);
};

const clearCategory = () => {
  showUpdateCategory.value = false;
  store.clearSelectedCategory();
};

loading.value = false;
</script>

<template>
  <div class="w-full">
    <ul
      role="list"
      class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
    >
      <AdminCategoryItem
        v-for="(category, categoryIndex) in store.categories"
        :key="category.id"
        :category="category"
        :categoryIndex="categoryIndex"
        @update-category="updateCategory"
      />

      <li
        class="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-center shadow"
      >
        <div class="flex flex-1 flex-col px-6 pt-6 pb-1">
          <FormKit
            type="form"
            id="storeCategory"
            data-testId="storeCategory"
            :actions="false"
            #default="{ state: { valid } }"
            @submit="createCategory"
          >
            <FormKit
              type="text"
              name="name"
              id="name"
              data-testId="category-name"
              placeholder="Category Name"
              validation="required"
            />
            <FormKit
              type="text"
              name="slug"
              id="slug"
              data-testId="category-slug"
              placeholder="Category Slug"
              validation="required"
            />
            <div class="mb-4 flex items-center gap-x-3 justify-between">
              <div v-if="categoryPreview">
                <img :src="categoryPreview" class="h-24 w-24 rounded-full" />
              </div>
              <UserCircleIcon
                v-else
                class="h-24 w-24 text-gray-300"
                aria-hidden="true"
              />
              <div class="w-2/5 flex items-center mt-3">
                <FormKit
                  type="file"
                  name="image"
                  id="image"
                  data-testId="category-image"
                  accept=".jpg,.png,.jpeg"
                  validation="required"
                  @change="categoryImagePreview"
                />
              </div>
            </div>

            <div class="flex gap-2">
              <FormKit type="button" @click="clearForm"> Cancel </FormKit>
              <FormKit type="submit" :disabled="!valid" />
            </div>
          </FormKit>
        </div>
      </li>
    </ul>
  </div>

  <LazyAdminCategoryUpdate v-if="showUpdateCategory" @close="clearCategory" />
</template>

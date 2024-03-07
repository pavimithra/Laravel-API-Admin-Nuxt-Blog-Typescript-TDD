<script setup lang="ts">
import { useCategoryStore } from "@/stores/categories";
import type { FormKitNode } from "@formkit/core";
import type { CategoryPayload } from "@/types";
import { UserCircleIcon } from "@heroicons/vue/20/solid";
const emit = defineEmits(["close"]);

const store = useCategoryStore();

async function categoryUpdate(payload: CategoryPayload, node?: FormKitNode) {
  try {
    await store.updateCategory(payload);
  } catch (err) {
    handleValidationErrors(err, node);
  }
}

const categoryPreview = ref("");

if (store.selectedCategory) {
  categoryPreview.value = store.selectedCategory.image;
}

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
</script>

<template>
  <div
    class="relative z-10"
    aria-labelledby="modal-title"
    role="dialog"
    aria-modal="true"
  >
    <div
      class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
    ></div>

    <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
      <div
        class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
      >
        <!-- Modal panel, show/hide based on modal state. -->
        <div
          class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6"
        >
          <div class="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
            <button
              type="button"
              data-testId="emit-close"
              @click="$emit('close')"
              class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <span class="sr-only">Close</span>
              <svg
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div class="flex flex-1 flex-col px-8 pt-6 pb-1 w-full">
            <FormKit
              type="form"
              id="storeCategory"
              data-testId="category-updateForm"
              :actions="false"
              #default="{ state: { valid } }"
              @submit="categoryUpdate"
            >
              <FormKit
                type="text"
                name="name"
                :value="store.selectedCategory?.name"
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
                :value="store.selectedCategory?.slug"
                placeholder="Category Slug"
                validation="required"
              />
              <div class="mb-4 flex items-center gap-x-3 justify-between">
                <div v-if="categoryPreview">
                  <img
                    :src="categoryPreview"
                    data-testId="category-preview"
                    class="h-24 w-24 rounded-full"
                  />
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
                    @change="categoryImagePreview"
                  />
                </div>
              </div>

              <div class="flex">
                <FormKit
                  type="button"
                  data-testId="cancel-button"
                  @click="$emit('close')"
                >
                  Cancel
                </FormKit>
                <FormKit
                  type="submit"
                  data-testId="update-button"
                  label="Update"
                  :disabled="!valid"
                />
              </div>
            </FormKit>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

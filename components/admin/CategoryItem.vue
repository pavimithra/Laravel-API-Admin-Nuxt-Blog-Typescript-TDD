<script setup lang="ts">
import { useCategoryStore } from "@/stores/categories";

defineProps<{
  category: {
    id: number;
    name: string;
    slug: string;
    image: string;
  };
  categoryIndex: number;
}>();

const store = useCategoryStore();

async function deleteCategory(categoryId: number) {
  try {
    await store.deleteCategory(categoryId);
    alert("Category Deleted Succesfully");
  } catch (err) {
    console.log("error");
  }
}

function handleDragStart(event: any, fromCategoryIndex: number): void {
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.dropEffect = "move";
  event.dataTransfer.setData("from-category-index", fromCategoryIndex);
}

function handleDrop(event: any, toCategoryIndex: number) {
  const fromCategoryIndex = event.dataTransfer.getData("from-category-index");

  store.moveSelectedCategory(fromCategoryIndex, toCategoryIndex);
}
</script>

<template>
  <li
    class="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-center shadow"
    draggable="true"
    data-testId="drag-startStop"
    @dragstart.self="handleDragStart($event, categoryIndex)"
    @dragenter.prevent
    @dragover.prevent
    @drop.stop="handleDrop($event, categoryIndex)"
  >
    <div class="flex flex-1 flex-col px-6 pt-6 pb-1">
      <img
        class="mx-auto h-32 w-32 flex-shrink-0 rounded-full"
        data-testId="category-image"
        :src="category.image"
        alt=""
      />
      <h3
        class="mt-6 text-sm font-medium text-gray-900"
        data-testId="category-name"
      >
        {{ category.name }}
      </h3>
      <dl class="mt-1 flex flex-grow flex-col justify-between">
        <dt class="sr-only">{{ category.name }}</dt>
        <dt class="sr-only">{{ category.slug }}</dt>
        <dd class="my-2">
          <span
            class="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20"
            data-testId="category-slug"
            >{{ category.slug }}</span
          >
        </dd>
      </dl>
      <div class="flex gap-2 mt-3">
        <FormKit
          type="button"
          data-testId="update-category"
          @click="$emit('update-category', category, categoryIndex)"
        >
          Update
        </FormKit>
        <FormKit
          type="button"
          data-testId="delete-category"
          @click="deleteCategory(category.id)"
        >
          Delete
        </FormKit>
      </div>
    </div>
  </li>
</template>

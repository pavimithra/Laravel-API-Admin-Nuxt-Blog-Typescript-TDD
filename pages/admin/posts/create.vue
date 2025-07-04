<script setup lang="ts">
import { UserCircleIcon } from "@heroicons/vue/20/solid";
import { reset } from "@formkit/core";
import type { FormKitNode } from "@formkit/core";
import type { PostPayload, Categories } from "@/types";
import { usePostStore } from "@/stores/posts";

definePageMeta({
  middleware: ["auth"],
  layout: "admin",
  title: "Create Post",
});

useHead({
  title: "Create Post",
});

const store = usePostStore();

store.isLoading = true;

const categories: Ref<Categories | null> = ref(null);

onMounted(async () => {
  categories.value = await store.fetchCategories();
});

const imagePreview = ref("");

function postImagePreview(event: Event): void {
  const inputElement = event.target as HTMLInputElement;
  if (inputElement.files && inputElement.files.length > 0) {
    const file = inputElement.files[0];
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      if (e.target && typeof e.target.result === "string") {
        imagePreview.value = e.target.result;
      }
    };
    reader.readAsDataURL(file);
  } else {
    imagePreview.value = "";
  }
}

function clearForm() {
  reset("createPost");
  imagePreview.value = "";
}

async function createPost(payload: PostPayload, node?: FormKitNode) {
  try {
    await store.storePost(payload);
    reset("createPost");
    imagePreview.value = "";
    await navigateTo("/admin/posts");
  } catch (err) {
    handleValidationErrors(err, node);
  }
}
</script>

<template>
  <div>
    <div class="flex gap-2 justify-end">
      <div>
        <NuxtLink to="/admin/posts">
          <FormKit type="button"> Back </FormKit>
        </NuxtLink>
      </div>
    </div>
    <div v-if="!store.isLoading">
      <FormKit
        type="form"
        id="createPost"
        data-testId="createPost"
        :actions="false"
        #default="{ state: { valid } }"
        @submit="createPost"
      >
        <FormKit
          type="text"
          label="Title"
          name="title"
          id="title"
          data-testId="post-title"
          validation="required"
        />
        <div class="flex gap-2">
          <FormKit
            type="text"
            label="Slug"
            name="slug"
            id="slug"
            data-testId="post-slug"
            validation="required"
          />
          <FormKit
            type="select"
            label="Category"
            name="category_id"
            id="category_id"
            data-testId="category_id"
            validation="required"
          >
            <option value="" disabled>Select a Category</option>
            <option v-for="(value, key) in categories" :key="key" :value="key">
              {{ value }}
            </option>
          </FormKit>
        </div>

        <FormKit
          type="textarea"
          label="Description"
          name="description"
          data-testId="post-description"
          id="description"
          validation="required"
        />
        <div class="mb-4 flex items-center gap-6 justify-left">
          <div v-if="imagePreview">
            <img :src="imagePreview" class="h-24 w-24 rounded-full" />
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
              label="Featured Image"
              data-testId="post-image"
              accept=".jpg,.png,.jpeg"
              validation="required"
              @change="postImagePreview"
            />
          </div>
        </div>
        <FormKit
          type="textarea"
          label="Content"
          name="content"
          id="content"
          data-testId="post-content"
          validation="required"
        />
        <div class="flex gap-2 justify-end">
          <div>
            <FormKit type="button" data-testId="post-cancel" @click="clearForm">
              Cancel
            </FormKit>
          </div>
          <div>
            <FormKit
              type="submit"
              data-testId="post-submit"
              :disabled="!valid"
            />
          </div>
        </div>
      </FormKit>
    </div>
  </div>
</template>

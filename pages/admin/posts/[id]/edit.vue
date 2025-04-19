<script setup lang="ts">
import type { Post, PostPayload, Categories } from "@/types";
import { usePostStore } from "@/stores/posts";
import type { FormKitNode } from "@formkit/core";
import { UserCircleIcon } from "@heroicons/vue/20/solid";

definePageMeta({
  middleware: ["auth"],
  layout: "admin",
  title: "Edit Post",
});

useHead({
  title: "Edit Post",
});

const store = usePostStore();

store.isLoading = true;

const route = useRoute();

const { id } = route.params;

const post: Ref<Post | null> = ref(null);

const categories: Ref<Categories | null> = ref(null);

const imagePreview = ref("");

onMounted(async () => {
  post.value = await store.showPost(Number(id));
  categories.value = await store.fetchCategories();
  if (post.value?.image) imagePreview.value = post.value.image;
});

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

async function editPost(payload: PostPayload, node?: FormKitNode) {
  try {
    await store.updatePost(Number(id), payload);
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
    <div v-if="store.isLoading">
      <div class="shadow rounded-md p-4 w-full">
        <div class="animate-pulse flex space-x-4">
          <div class="flex-1 space-y-6 py-1">
            <div class="space-y-2">
              <h1 class="h-10 w-full sm:w-1/2 bg-slate-200 rounded"></h1>
              <h3 class="h-5 w-full sm:w-1/2 bg-slate-200 rounded"></h3>
            </div>
            <div class="space-y-3">
              <p class="h-6 bg-slate-200 rounded"></p>
              <p class="h-80 bg-slate-200 rounded"></p>
              <p class="h-10 bg-slate-200 rounded"></p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="post">
      <FormKit
        type="form"
        id="editPost"
        data-testId="editPost"
        :actions="false"
        #default="{ state: { valid } }"
        @submit="editPost"
      >
        <FormKit
          type="text"
          label="Title"
          name="title"
          id="title"
          data-testId="post-title"
          :value="post.title"
          validation="required"
        />
        <div class="flex gap-2">
          <FormKit
            type="text"
            label="Slug"
            name="slug"
            id="slug"
            :value="post.slug"
            data-testId="post-slug"
            validation="required"
          />
          <FormKit
            type="select"
            label="Category"
            name="category_id"
            id="category_id"
            :value="post.category_id"
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
          :value="post.description"
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
              @change="postImagePreview"
            />
          </div>
        </div>
        <FormKit
          type="textarea"
          label="Content"
          name="content"
          id="content"
          :value="post.content"
          data-testId="post-content"
          validation="required"
        />
        <div class="flex gap-2 justify-end">
          <NuxtLink to="/admin/posts">
            <FormKit type="button"> Cancel </FormKit>
          </NuxtLink>
          <div>
            <FormKit
              type="submit"
              label="Update"
              data-testId="post-submit"
              :disabled="!valid"
            />
          </div>
        </div>
      </FormKit>
    </div>
  </div>
</template>

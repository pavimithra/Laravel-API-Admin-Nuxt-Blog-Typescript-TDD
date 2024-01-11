<script setup lang="ts">
import type { LoginPayload } from "@/types"
import type { FormKitNode } from "@formkit/core";

definePageMeta({
    layout: "auth",
    middleware: ["guest"],
    title: "Login to your Account"
});

useHead({
    title: 'Login',
})

const { login } = useAuth();

async function userLogin(payload: LoginPayload, node?: FormKitNode) {
    try {
        await login(payload);
    } catch (err) {
        handleValidationErrors(err, node);
    }
}
</script>

<template>
    <FormKit type="form" submit-label="Login" @submit="userLogin">
      <FormKit label="Email" name="email" type="email" autocomplete="email" id="email" validation="required" />
      <FormKit label="Password" name="password" type="password" autocomplete="current-password" id="password" validation="required" />
    </FormKit>
    <p class="mt-5 text-right text-sm text-gray-500">
        Not a member?
        <NuxtLink class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500 underline" to="/admin/register"> Register Here</NuxtLink>
    </p>
</template>
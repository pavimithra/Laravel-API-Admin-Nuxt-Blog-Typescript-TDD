<script setup lang="ts">
import type { RegisterPayload } from "@/types";
import type { FormKitNode } from "@formkit/core";

definePageMeta({
    layout: "auth",
    middleware: ["guest"],
    title: "Registration Form"
});

useHead({
    title: 'Register',
})

const { register } = useAuth();

async function userRegister(payload: RegisterPayload, node?: FormKitNode) {
    try {
        await register(payload);
    } catch (err) {
        handleValidationErrors(err, node);
    }
}
</script>

<template>
    <FormKit type="form" submit-label="Register" @submit="userRegister">
        <FormKit type="text" label="Name" name="name" autocomplete="name" id="name" validation="required" />
        <FormKit type="text" label="Email" name="email" autocomplete="email" id="email" validation="required" />
        <FormKit type="password" label="Password" name="password" autocomplete="current-password" id="password" validation="required" />
        <FormKit type="password" label="Confirm Password" name="password_confirmation" id="password_confirmation" validation="required|confirm:password" />
    </FormKit>
    <p class="mt-10 text-right text-sm text-gray-500">
        Already have an account?
        <NuxtLink class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500 underline" to="/admin/login"> Login Here</NuxtLink>
    </p>
</template>
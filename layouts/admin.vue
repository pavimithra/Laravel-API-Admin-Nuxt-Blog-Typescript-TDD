<script setup lang="ts">
import { XMarkIcon } from '@heroicons/vue/24/outline'

useHead({
    htmlAttrs: {
        class: 'h-full bg-white'
    },
    bodyAttrs: {
        class: 'h-full'
    },
})

const sidebarOpen = ref(false)
</script>

<template>
    <div>
        <!-- Off-canvas menu for mobile, show/hide based on off-canvas menu state. -->
        <div class="relative z-50 lg:hidden" role="dialog" aria-modal="true" :class="{'block': sidebarOpen, 'hidden': ! sidebarOpen}">
            <div class="fixed inset-0 bg-gray-900/80"></div>

            <div class="fixed inset-0 flex">
                <div class="relative mr-16 flex w-full max-w-xs flex-1">
                    <div class="absolute left-full top-0 flex w-16 justify-center pt-5">
                        <button type="button" class="-m-2.5 p-2.5" @click="sidebarOpen = ! sidebarOpen">
                            <span class="sr-only">Close sidebar</span>
                            <XMarkIcon class="h-6 w-6 text-white" aria-hidden="true" />
                        </button>
                    </div>
                    <!-- Sidebar component, swap this element with another sidebar if you like -->
                    <AdminAppSidebar />
                </div>
            </div>
        </div>

        <!-- Static sidebar for desktop -->
        <div class="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
            <!-- Sidebar component, swap this element with another sidebar if you like -->
            <AdminAppSidebar />
        </div>

        <div class="lg:pl-72">
            <AdminAppHeader @sidebar-visible="sidebarOpen = true" />
            <main>
                <header class="text-2xl lg:text-4xl text-gray-900 font-dance font-bold bg-gray-200 px-4 py-3 lg:py-4 xl:px-8 uppercase">
                    <slot name="header">
                        Dashboard
                    </slot>
                </header>

                <div class="px-4 sm:px-6 lg:px-8 py-5">
                    <slot />
                </div>
            </main>
        </div>
    </div>
</template>
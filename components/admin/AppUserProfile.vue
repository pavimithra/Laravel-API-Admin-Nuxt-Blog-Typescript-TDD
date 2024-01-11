<script setup lang="ts">
import { ChevronDownIcon } from '@heroicons/vue/20/solid'

const { user } = useAuth();

const handleClickedOutside = () => { if(profileOpen.value) profileOpen.value = false };

const userNavigation = [
  { name: 'Your profile', href: '#' },
  { name: 'Logout', href: '/admin/logout' },
]

const profileOpen = ref(false)

</script>

<template>
    <div class="box" v-click-outside="handleClickedOutside">
        <button @click="profileOpen = ! profileOpen" type="button" class="-m-1.5 flex items-center p-1.5" id="user-menu-button" aria-expanded="false" aria-haspopup="true">
            <span class="sr-only">Open user menu</span>
            <img src="/assets/avatar/no-image.jpg" class="h-8 w-8 rounded-full bg-gray-50" alt="User Image" />
            <span class="hidden lg:flex lg:items-center">
                <span class="ml-4 text-sm font-semibold leading-6 text-gray-900" aria-hidden="true">{{ user!.name }}</span>
                <ChevronDownIcon class="ml-2 h-5 w-5 text-gray-400" aria-hidden="true" />
            </span>
        </button>

        <div :class="{'block': profileOpen, 'hidden': ! profileOpen}" class="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button" tabindex="-1">
            <!-- Active: "bg-gray-50", Not Active: "" -->
            <div v-for="item in userNavigation" :key="item.name">
                <NuxtLink :to="item.href" class="block px-3 py-1 text-sm leading-6 text-gray-900 hover:bg-gray-200">
                    {{ item.name }}
                </NuxtLink>
            </div>
        </div>
    </div>
</template>
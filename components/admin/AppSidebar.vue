<script setup lang="ts">
import {
  HomeIcon,
  UsersIcon,
  Square3Stack3DIcon,
  SquaresPlusIcon,
  Cog6ToothIcon,
} from "@heroicons/vue/24/outline";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: HomeIcon },
  { name: "Users", href: "/admin/users", icon: UsersIcon },
  { name: "Categories", href: "/admin/categories", icon: Square3Stack3DIcon },
  { name: "Posts", href: "/admin/posts", icon: SquaresPlusIcon },
];

const reports = [
  { name: "Monthly", href: "/admin/reports/monthly", initial: "M" },
  { name: "Yearly", href: "/admin/reports/yearly", initial: "Y" },
];
</script>

<template>
  <div class="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-4">
    <div class="flex h-16 shrink-0 items-center">
      <NuxtLink to="/admin"><Logo class="h-8 w-auto" /></NuxtLink>
    </div>
    <nav class="flex flex-1 flex-col">
      <ul role="list" class="flex flex-1 flex-col gap-y-7">
        <li>
          <ul role="list" class="-mx-2 space-y-1">
            <li v-for="item in navigation" :key="item.name">
              <NuxtLink
                :to="item.href"
                activeClass="bg-gray-800 text-white"
                class="text-gray-400 hover:text-white hover:bg-gray-800', 'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
              >
                <component
                  :is="item.icon"
                  class="h-6 w-6 shrink-0"
                  aria-hidden="true"
                />
                {{ item.name }}
              </NuxtLink>
            </li>
          </ul>
        </li>
        <li>
          <div class="text-xs font-semibold leading-6 text-gray-400">
            Reports
          </div>
          <ul role="list" class="-mx-2 mt-2 space-y-1">
            <li v-for="report in reports" :key="report.name">
              <NuxtLink
                :to="report.href"
                activeClass="bg-gray-800 text-white"
                class="text-gray-400 hover:text-white hover:bg-gray-800', 'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
              >
                <span
                  class="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-gray-700 bg-gray-800 text-[0.625rem] font-medium text-gray-400 group-hover:text-white"
                  >{{ report.initial }}</span
                >
                <span class="truncate">{{ report.name }}</span>
              </NuxtLink>
            </li>
          </ul>
        </li>
        <li class="mt-auto">
          <NuxtLink
            to="#"
            class="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-400 hover:bg-gray-800 hover:text-white"
          >
            <Cog6ToothIcon class="h-6 w-6 shrink-0" aria-hidden="true" />
            Settings
          </NuxtLink>
        </li>
      </ul>
    </nav>
  </div>
</template>

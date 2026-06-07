<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const { logout } = useAuth()
const router = useRouter()
const sidebarOpen = ref(false)

const navLinks = [
  { to: '/', label: 'Dashboard', icon: 'ri-dashboard-line' },
  { to: '/projects', label: 'Projects', icon: 'ri-folder-3-line' },
  { to: '/donations', label: 'Donations', icon: 'ri-heart-line' },
  { to: '/expenses', label: 'Expenses', icon: 'ri-receipt-line' },
  { to: '/timeline', label: 'Timeline', icon: 'ri-time-line' },
  { to: '/photos', label: 'Photos', icon: 'ri-image-line' },
  { to: '/activities', label: 'Activities', icon: 'ri-calendar-event-line' },
]

function handleLogout() {
  logout()
}

function isActive(to: string): boolean {
  if (to === '/') return router.currentRoute.value.path === '/'
  return router.currentRoute.value.path.startsWith(to)
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Mobile overlay -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 bg-black/40 z-20 lg:hidden"
      @click="sidebarOpen = false"
    />

    <!-- Sidebar -->
    <aside
      :class="[
        'fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg flex flex-col transition-transform duration-200',
        'lg:translate-x-0 lg:static lg:z-auto lg:shadow-none lg:border-r lg:border-gray-200',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full',
      ]"
    >
      <!-- Sidebar header -->
      <div class="flex items-center gap-3 px-6 py-5 border-b border-gray-200 bg-green-700">
        <img src="/logo.png" alt="IC Moscow" class="h-10 w-10 object-contain drop-shadow-md" />
        <div>
          <p class="text-white font-semibold leading-tight">IC Moscow</p>
          <p class="text-green-200 text-xs">Admin Portal</p>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <RouterLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          :class="[
            'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
            isActive(link.to)
              ? 'bg-green-50 text-green-700'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
          ]"
          @click="sidebarOpen = false"
        >
          <i :class="[link.icon, 'text-lg']" />
          {{ link.label }}
        </RouterLink>
      </nav>

      <!-- Logout -->
      <div class="p-4 border-t border-gray-200">
        <button
          class="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-700 transition-colors"
          @click="handleLogout"
        >
          <i class="ri-logout-box-line text-lg" />
          Sign out
        </button>
      </div>
    </aside>

    <!-- Main content -->
    <div class="flex-1 flex flex-col min-w-0">
      <!-- Top bar (mobile) -->
      <header class="lg:hidden flex items-center gap-3 px-4 py-3 bg-green-700 sticky top-0 z-10">
        <button
          class="p-2 rounded-lg text-white/80 hover:bg-white/10"
          @click="sidebarOpen = !sidebarOpen"
        >
          <i class="ri-menu-line text-xl" />
        </button>
        <img src="/logo.png" alt="IC Moscow" class="h-8 w-8 object-contain drop-shadow-md" />
        <span class="font-semibold text-white">IC Moscow Admin</span>
      </header>

      <!-- Page content -->
      <main class="flex-1 p-4 sm:p-6 lg:p-8">
        <slot />
      </main>
    </div>
  </div>
</template>

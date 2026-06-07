<script setup lang="ts">
import { ref } from 'vue'
import AuthLayout from '../layouts/AuthLayout.vue'
import AlertBanner from '../components/AlertBanner.vue'
import { useAuth } from '../composables/useAuth'

const { login, loading, error } = useAuth()
const username = ref('')
const password = ref('')

async function handleSubmit() {
  await login(username.value, password.value)
}
</script>

<template>
  <AuthLayout>
    <form class="space-y-5" @submit.prevent="handleSubmit">
      <AlertBanner v-if="error" :message="error" type="error" />

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1.5">Username</label>
        <input
          v-model="username"
          type="text"
          autocomplete="username"
          required
          class="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="admin"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
        <input
          v-model="password"
          type="password"
          autocomplete="current-password"
          required
          class="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="••••••••"
        />
      </div>

      <button
        type="submit"
        :disabled="loading"
        class="w-full py-2.5 px-4 bg-green-700 hover:bg-green-800 disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition-colors"
      >
        <span v-if="loading">Signing in…</span>
        <span v-else>Sign in</span>
      </button>
    </form>
  </AuthLayout>
</template>

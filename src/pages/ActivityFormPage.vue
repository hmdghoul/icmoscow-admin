<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminLayout from '../layouts/AdminLayout.vue'
import AlertBanner from '../components/AlertBanner.vue'
import { useActivities } from '../composables/useActivities'
import { createActivity, updateActivity } from '../services/activities.service'
import { ACTIVITY_CATEGORIES } from '../types'

const route = useRoute()
const router = useRouter()
const { activities, refresh } = useActivities()

const isEdit = computed(() => !!route.params.id)
const editId = computed(() => route.params.id as string | undefined)
const form = ref({ category: '', title: '', description: '', schedule: '', location: 'Islamic Center' })

watch(editId, (id) => {
  if (!id) return
  const a = activities.value.find((x) => x.id === id)
  if (a) form.value = { category: a.category, title: a.title, description: a.description, schedule: a.schedule, location: a.location }
}, { immediate: true })

const loading = ref(false)
const submitError = ref<string | null>(null)

async function handleSubmit() {
  submitError.value = null
  loading.value = true
  try {
    if (isEdit.value && editId.value) await updateActivity(editId.value, form.value)
    else await createActivity(form.value)
    refresh()
    router.push('/activities')
  } catch (e) {
    submitError.value = e instanceof Error ? e.message : 'Failed to save.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <AdminLayout>
    <div class="max-w-lg mx-auto space-y-6">
      <div class="flex items-center gap-3">
        <button class="text-gray-400 hover:text-gray-600" @click="router.back()"><i class="ri-arrow-left-line text-xl" /></button>
        <h1 class="text-2xl font-bold text-gray-900">{{ isEdit ? 'Edit Activity' : 'New Activity' }}</h1>
      </div>

      <form class="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-5" @submit.prevent="handleSubmit">
        <AlertBanner v-if="submitError" :message="submitError" type="error" />

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Category <span class="text-red-500">*</span></label>
          <select v-model="form.category" required class="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500">
            <option value="" disabled>Select a category…</option>
            <option v-for="c in ACTIVITY_CATEGORIES" :key="c" :value="c">{{ c }}</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Title <span class="text-red-500">*</span></label>
          <input v-model="form.title" type="text" required class="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Quran Class for Children" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Description <span class="text-red-500">*</span></label>
          <textarea v-model="form.description" rows="4" required class="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Schedule <span class="text-red-500">*</span></label>
          <input v-model="form.schedule" type="text" required class="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Every Saturday 10am" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Location <span class="text-red-500">*</span></label>
          <input v-model="form.location" type="text" required class="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
        </div>

        <div class="flex gap-3 pt-2">
          <button type="button" class="px-4 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50" @click="router.back()">Cancel</button>
          <button type="submit" :disabled="loading" class="flex-1 py-2.5 bg-green-700 hover:bg-green-800 disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition-colors">
            {{ loading ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Activity' }}
          </button>
        </div>
      </form>
    </div>
  </AdminLayout>
</template>

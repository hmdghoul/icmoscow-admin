<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminLayout from '../layouts/AdminLayout.vue'
import AlertBanner from '../components/AlertBanner.vue'
import { useProjects } from '../composables/useProjects'
import { useTimeline } from '../composables/useTimeline'
import { createTimelineEntry, updateTimelineEntry } from '../services/timeline.service'

const route = useRoute()
const router = useRouter()
const { projects } = useProjects()
const { timeline, refresh } = useTimeline()

const isEdit = computed(() => !!route.params.id)
const editId = computed(() => route.params.id as string | undefined)
const form = ref({ projectId: (route.query.projectId as string) ?? '', date: '', title: '', update: '' })

watch(editId, (id) => {
  if (!id) return
  const t = timeline.value.find((x) => x.id === id)
  if (t) form.value = { projectId: t.projectId, date: t.date, title: t.title, update: t.update }
}, { immediate: true })

const loading = ref(false)
const submitError = ref<string | null>(null)

async function handleSubmit() {
  submitError.value = null
  loading.value = true
  try {
    if (isEdit.value && editId.value) await updateTimelineEntry(editId.value, form.value)
    else await createTimelineEntry(form.value)
    refresh()
    router.push('/timeline')
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
        <h1 class="text-2xl font-bold text-gray-900">{{ isEdit ? 'Edit Timeline Entry' : 'New Timeline Entry' }}</h1>
      </div>

      <form class="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-5" @submit.prevent="handleSubmit">
        <AlertBanner v-if="submitError" :message="submitError" type="error" />

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Project <span class="text-red-500">*</span></label>
          <select v-model="form.projectId" required class="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500">
            <option value="" disabled>Select a project…</option>
            <option v-for="p in projects" :key="p.id" :value="p.id">{{ p.title }}</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Date <span class="text-red-500">*</span></label>
          <input v-model="form.date" type="date" required class="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Title <span class="text-red-500">*</span></label>
          <input v-model="form.title" type="text" required class="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Contractor Selection" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Update <span class="text-red-500">*</span></label>
          <textarea v-model="form.update" rows="5" required class="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none" placeholder="Describe what happened…" />
        </div>

        <div class="flex gap-3 pt-2">
          <button type="button" class="px-4 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50" @click="router.back()">Cancel</button>
          <button type="submit" :disabled="loading" class="flex-1 py-2.5 bg-green-700 hover:bg-green-800 disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition-colors">
            {{ loading ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Entry' }}
          </button>
        </div>
      </form>
    </div>
  </AdminLayout>
</template>

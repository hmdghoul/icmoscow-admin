<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import AdminLayout from '../layouts/AdminLayout.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import AlertBanner from '../components/AlertBanner.vue'
import ConfirmDialog from '../components/ConfirmDialog.vue'
import ToastContainer from '../components/ToastContainer.vue'
import { useTimeline } from '../composables/useTimeline'
import { useProjects } from '../composables/useProjects'
import { useToast } from '../composables/useToast'
import { deleteTimelineEntry } from '../services/timeline.service'
import { formatDate } from '../utils/format'

const router = useRouter()
const { timeline, loading, error, refresh } = useTimeline()
const { projects } = useProjects()
const { success, error: toastError } = useToast()
const filterProjectId = ref('')
const deleteTarget = ref<string | null>(null)

const filtered = computed(() =>
  filterProjectId.value ? timeline.value.filter((t) => t.projectId === filterProjectId.value) : timeline.value,
)

function projectTitle(id: string) {
  return projects.value.find((p) => p.id === id)?.title ?? id
}

async function confirmDelete() {
  if (!deleteTarget.value) return
  try {
    await deleteTimelineEntry(deleteTarget.value)
    success('Timeline entry deleted.')
    refresh()
  } catch (e) {
    toastError(e instanceof Error ? e.message : 'Failed to delete.')
  } finally {
    deleteTarget.value = null
  }
}
</script>

<template>
  <AdminLayout>
    <ToastContainer />
    <ConfirmDialog :open="!!deleteTarget" title="Delete Entry" message="Delete this timeline entry?" danger @confirm="confirmDelete" @cancel="deleteTarget = null" />

    <div class="space-y-6">
      <div class="flex items-center justify-between flex-wrap gap-3">
        <h1 class="text-2xl font-bold text-gray-900">Timeline</h1>
        <router-link to="/timeline/new" class="inline-flex items-center gap-2 px-4 py-2 bg-green-700 hover:bg-green-800 text-white text-sm font-medium rounded-lg transition-colors">
          <i class="ri-add-line" /> New Entry
        </router-link>
      </div>

      <select v-model="filterProjectId" class="w-56 px-3 py-2 rounded-lg border border-gray-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500">
        <option value="">All Projects</option>
        <option v-for="p in projects" :key="p.id" :value="p.id">{{ p.title }}</option>
      </select>

      <AlertBanner v-if="error" :message="error" type="error" />
      <LoadingSpinner v-else-if="loading" />

      <div v-else class="space-y-3">
        <div v-if="filtered.length === 0" class="text-gray-400 text-center py-12 text-sm">No timeline entries.</div>
        <div v-for="t in filtered" :key="t.id" class="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div class="flex items-start justify-between gap-3">
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-1 flex-wrap">
                <span class="font-semibold text-gray-800">{{ t.title }}</span>
                <span class="text-xs text-gray-400">{{ formatDate(t.date) }}</span>
                <span class="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">{{ projectTitle(t.projectId) }}</span>
              </div>
              <p class="text-sm text-gray-600">{{ t.update }}</p>
            </div>
            <div class="flex items-center gap-2 shrink-0">
              <button class="p-1.5 rounded text-gray-400 hover:text-green-700 hover:bg-green-50" @click="router.push(`/timeline/${t.id}/edit`)"><i class="ri-edit-line" /></button>
              <button class="p-1.5 rounded text-gray-400 hover:text-red-600 hover:bg-red-50" @click="deleteTarget = t.id"><i class="ri-delete-bin-line" /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

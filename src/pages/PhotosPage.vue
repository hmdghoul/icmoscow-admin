<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import AdminLayout from '../layouts/AdminLayout.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import AlertBanner from '../components/AlertBanner.vue'
import ConfirmDialog from '../components/ConfirmDialog.vue'
import ToastContainer from '../components/ToastContainer.vue'
import { usePhotos } from '../composables/usePhotos'
import { useProjects } from '../composables/useProjects'
import { useToast } from '../composables/useToast'
import { deletePhoto } from '../services/photos.service'
import { resolveImageUrl } from '../utils/image'

const router = useRouter()
const { photos, loading, error, refresh } = usePhotos()
const { projects } = useProjects()
const { success, error: toastError } = useToast()
const filterProjectId = ref('')
const deleteTarget = ref<string | null>(null)

const filtered = computed(() =>
  filterProjectId.value ? photos.value.filter((p) => p.projectId === filterProjectId.value) : photos.value,
)

async function confirmDelete() {
  if (!deleteTarget.value) return
  try {
    await deletePhoto(deleteTarget.value)
    success('Photo deleted.')
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
    <ConfirmDialog :open="!!deleteTarget" title="Delete Photo" message="Delete this photo record?" danger @confirm="confirmDelete" @cancel="deleteTarget = null" />

    <div class="space-y-6">
      <div class="flex items-center justify-between flex-wrap gap-3">
        <h1 class="text-2xl font-bold text-gray-900">Photos</h1>
        <router-link to="/photos/new" class="inline-flex items-center gap-2 px-4 py-2 bg-green-700 hover:bg-green-800 text-white text-sm font-medium rounded-lg transition-colors">
          <i class="ri-add-line" /> Upload Photo
        </router-link>
      </div>

      <select v-model="filterProjectId" class="w-56 px-3 py-2 rounded-lg border border-gray-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500">
        <option value="">All Projects</option>
        <option v-for="p in projects" :key="p.id" :value="p.id">{{ p.title }}</option>
      </select>

      <AlertBanner v-if="error" :message="error" type="error" />
      <LoadingSpinner v-else-if="loading" />

      <div v-else>
        <div v-if="filtered.length === 0" class="text-gray-400 text-center py-12 text-sm">No photos.</div>
        <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          <div v-for="p in filtered" :key="p.id" class="group bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div class="relative">
              <img :src="resolveImageUrl(p.imageLink)" :alt="p.caption" class="w-full h-36 object-cover" />
              <div class="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button class="p-1.5 rounded-lg bg-white shadow text-gray-600 hover:text-green-700" @click="router.push(`/photos/${p.id}/edit`)"><i class="ri-edit-line text-sm" /></button>
                <button class="p-1.5 rounded-lg bg-white shadow text-gray-600 hover:text-red-600" @click="deleteTarget = p.id"><i class="ri-delete-bin-line text-sm" /></button>
              </div>
            </div>
            <div class="p-3">
              <span class="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">{{ p.type }}</span>
              <p v-if="p.caption" class="text-xs text-gray-500 mt-1 truncate">{{ p.caption }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

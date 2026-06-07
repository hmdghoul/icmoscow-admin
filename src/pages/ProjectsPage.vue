<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AdminLayout from '../layouts/AdminLayout.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import AlertBanner from '../components/AlertBanner.vue'
import StatusBadge from '../components/StatusBadge.vue'
import ConfirmDialog from '../components/ConfirmDialog.vue'
import ToastContainer from '../components/ToastContainer.vue'
import { useProjects } from '../composables/useProjects'
import { useToast } from '../composables/useToast'
import { deleteProject } from '../services/projects.service'
import { formatCurrency } from '../utils/format'

const router = useRouter()
const { projects, loading, error, refresh } = useProjects()
const { success, error: toastError } = useToast()

const deleteTarget = ref<string | null>(null)
const deleting = ref(false)

async function confirmDelete() {
  if (!deleteTarget.value) return
  deleting.value = true
  try {
    await deleteProject(deleteTarget.value)
    success('Project deleted.')
    refresh()
  } catch (e) {
    toastError(e instanceof Error ? e.message : 'Failed to delete project.')
  } finally {
    deleting.value = false
    deleteTarget.value = null
  }
}
</script>

<template>
  <AdminLayout>
    <ToastContainer />
    <ConfirmDialog
      :open="!!deleteTarget"
      title="Delete Project"
      message="Are you sure you want to delete this project? All related records will remain in the sheet."
      danger
      @confirm="confirmDelete"
      @cancel="deleteTarget = null"
    />

    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold text-gray-900">Projects</h1>
        <router-link
          to="/projects/new"
          class="inline-flex items-center gap-2 px-4 py-2 bg-green-700 hover:bg-green-800 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <i class="ri-add-line" /> New Project
        </router-link>
      </div>

      <AlertBanner v-if="error" :message="error" type="error" />
      <LoadingSpinner v-else-if="loading" />

      <div v-else class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div v-if="projects.length === 0" class="px-6 py-12 text-center text-gray-400">
          No projects yet. <router-link to="/projects/new" class="text-green-600 font-medium">Add one.</router-link>
        </div>
        <table v-else class="w-full text-sm min-w-full">
          <thead class="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
            <tr>
              <th class="px-6 py-3 text-left">ID</th>
              <th class="px-6 py-3 text-left">Title</th>
              <th class="px-6 py-3 text-left">Status</th>
              <th class="px-6 py-3 text-right">Goal</th>
              <th class="px-6 py-3 text-right">Raised</th>
              <th class="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="p in projects" :key="p.id" class="hover:bg-gray-50">
              <td class="px-6 py-3 font-mono text-xs text-gray-500">{{ p.id }}</td>
              <td class="px-6 py-3 font-medium text-gray-800">
                <router-link :to="`/projects/${p.id}`" class="hover:text-green-700">{{ p.title }}</router-link>
              </td>
              <td class="px-6 py-3"><StatusBadge :status="p.status" /></td>
              <td class="px-6 py-3 text-right text-gray-600">{{ formatCurrency(p.goal) }}</td>
              <td class="px-6 py-3 text-right text-gray-600">{{ formatCurrency(p.raised) }}</td>
              <td class="px-6 py-3 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button
                    class="p-1.5 rounded text-gray-400 hover:text-green-700 hover:bg-green-50 transition-colors"
                    title="Edit"
                    @click="router.push(`/projects/${p.id}/edit`)"
                  >
                    <i class="ri-edit-line text-base" />
                  </button>
                  <button
                    class="p-1.5 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Delete"
                    @click="deleteTarget = p.id"
                  >
                    <i class="ri-delete-bin-line text-base" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </AdminLayout>
</template>

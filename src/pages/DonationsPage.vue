<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import AdminLayout from '../layouts/AdminLayout.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import AlertBanner from '../components/AlertBanner.vue'
import ConfirmDialog from '../components/ConfirmDialog.vue'
import ToastContainer from '../components/ToastContainer.vue'
import { useDonations } from '../composables/useDonations'
import { useProjects } from '../composables/useProjects'
import { useToast } from '../composables/useToast'
import { deleteDonation } from '../services/donations.service'
import { formatCurrency, formatDate } from '../utils/format'

const router = useRouter()
const { donations, loading, error, refresh } = useDonations()
const { projects } = useProjects()
const { success, error: toastError } = useToast()

const filterProjectId = ref('')
const deleteTarget = ref<string | null>(null)

const filtered = computed(() =>
  filterProjectId.value
    ? donations.value.filter((d) => d.projectId === filterProjectId.value)
    : donations.value,
)

function projectTitle(id: string) {
  return projects.value.find((p) => p.id === id)?.title ?? id
}

async function confirmDelete() {
  if (!deleteTarget.value) return
  try {
    await deleteDonation(deleteTarget.value)
    success('Donation deleted.')
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
    <ConfirmDialog
      :open="!!deleteTarget"
      title="Delete Donation"
      message="Are you sure you want to delete this donation record?"
      danger
      @confirm="confirmDelete"
      @cancel="deleteTarget = null"
    />

    <div class="space-y-6">
      <div class="flex items-center justify-between flex-wrap gap-3">
        <h1 class="text-2xl font-bold text-gray-900">Donations</h1>
        <router-link to="/donations/new" class="inline-flex items-center gap-2 px-4 py-2 bg-green-700 hover:bg-green-800 text-white text-sm font-medium rounded-lg transition-colors">
          <i class="ri-add-line" /> New Donation
        </router-link>
      </div>

      <!-- Filter -->
      <select
        v-model="filterProjectId"
        class="w-56 px-3 py-2 rounded-lg border border-gray-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        <option value="">All Projects</option>
        <option v-for="p in projects" :key="p.id" :value="p.id">{{ p.title }}</option>
      </select>

      <AlertBanner v-if="error" :message="error" type="error" />
      <LoadingSpinner v-else-if="loading" />

      <div v-else class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
        <div v-if="filtered.length === 0" class="px-6 py-12 text-center text-gray-400 text-sm">No donations found.</div>
        <table v-else class="w-full text-sm min-w-full">
          <thead class="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th class="px-4 py-3 text-left">Project</th>
              <th class="px-4 py-3 text-left">Source</th>
              <th class="px-4 py-3 text-right">Amount</th>
              <th class="px-4 py-3 text-left">Date</th>
              <th class="px-4 py-3 text-left">Note</th>
              <th class="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="d in filtered" :key="d.id" class="hover:bg-gray-50">
              <td class="px-4 py-3 text-gray-700 font-medium">{{ projectTitle(d.projectId) }}</td>
              <td class="px-4 py-3 text-gray-600">{{ d.source }}</td>
              <td class="px-4 py-3 text-right text-gray-700">{{ formatCurrency(d.amount) }}</td>
              <td class="px-4 py-3 text-gray-500">{{ formatDate(d.date) }}</td>
              <td class="px-4 py-3 text-gray-500 max-w-xs truncate">{{ d.note }}</td>
              <td class="px-4 py-3 text-right">
                <div class="flex justify-end gap-2">
                  <button class="p-1.5 rounded text-gray-400 hover:text-green-700 hover:bg-green-50 transition-colors" @click="router.push(`/donations/${d.id}/edit`)">
                    <i class="ri-edit-line text-base" />
                  </button>
                  <button class="p-1.5 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors" @click="deleteTarget = d.id">
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

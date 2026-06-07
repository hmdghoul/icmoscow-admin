<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import AdminLayout from '../layouts/AdminLayout.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import AlertBanner from '../components/AlertBanner.vue'
import ConfirmDialog from '../components/ConfirmDialog.vue'
import ToastContainer from '../components/ToastContainer.vue'
import { useExpenses } from '../composables/useExpenses'
import { useProjects } from '../composables/useProjects'
import { useToast } from '../composables/useToast'
import { deleteExpense } from '../services/expenses.service'
import { formatCurrency, formatDate } from '../utils/format'

const router = useRouter()
const { expenses, loading, error, refresh } = useExpenses()
const { projects } = useProjects()
const { success, error: toastError } = useToast()
const filterProjectId = ref('')
const deleteTarget = ref<string | null>(null)

const filtered = computed(() =>
  filterProjectId.value ? expenses.value.filter((e) => e.projectId === filterProjectId.value) : expenses.value,
)

function projectTitle(id: string) {
  return projects.value.find((p) => p.id === id)?.title ?? id
}

async function confirmDelete() {
  if (!deleteTarget.value) return
  try {
    await deleteExpense(deleteTarget.value)
    success('Expense deleted.')
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
    <ConfirmDialog :open="!!deleteTarget" title="Delete Expense" message="Delete this expense record?" danger @confirm="confirmDelete" @cancel="deleteTarget = null" />

    <div class="space-y-6">
      <div class="flex items-center justify-between flex-wrap gap-3">
        <h1 class="text-2xl font-bold text-gray-900">Expenses</h1>
        <router-link to="/expenses/new" class="inline-flex items-center gap-2 px-4 py-2 bg-green-700 hover:bg-green-800 text-white text-sm font-medium rounded-lg transition-colors">
          <i class="ri-add-line" /> New Expense
        </router-link>
      </div>

      <select v-model="filterProjectId" class="w-56 px-3 py-2 rounded-lg border border-gray-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500">
        <option value="">All Projects</option>
        <option v-for="p in projects" :key="p.id" :value="p.id">{{ p.title }}</option>
      </select>

      <AlertBanner v-if="error" :message="error" type="error" />
      <LoadingSpinner v-else-if="loading" />

      <div v-else class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
        <div v-if="filtered.length === 0" class="px-6 py-12 text-center text-gray-400 text-sm">No expenses found.</div>
        <table v-else class="w-full text-sm">
          <thead class="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th class="px-4 py-3 text-left">Project</th>
              <th class="px-4 py-3 text-left">Item</th>
              <th class="px-4 py-3 text-right">Amount</th>
              <th class="px-4 py-3 text-left">Date</th>
              <th class="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="e in filtered" :key="e.id" class="hover:bg-gray-50">
              <td class="px-4 py-3 text-gray-700">{{ projectTitle(e.projectId) }}</td>
              <td class="px-4 py-3 font-medium text-gray-800">{{ e.item }}</td>
              <td class="px-4 py-3 text-right text-gray-700">{{ formatCurrency(e.amount) }}</td>
              <td class="px-4 py-3 text-gray-500">{{ formatDate(e.date) }}</td>
              <td class="px-4 py-3 text-right">
                <div class="flex justify-end gap-2">
                  <button class="p-1.5 rounded text-gray-400 hover:text-green-700 hover:bg-green-50" @click="router.push(`/expenses/${e.id}/edit`)"><i class="ri-edit-line text-base" /></button>
                  <button class="p-1.5 rounded text-gray-400 hover:text-red-600 hover:bg-red-50" @click="deleteTarget = e.id"><i class="ri-delete-bin-line text-base" /></button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import AdminLayout from '../layouts/AdminLayout.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import AlertBanner from '../components/AlertBanner.vue'
import ConfirmDialog from '../components/ConfirmDialog.vue'
import ToastContainer from '../components/ToastContainer.vue'
import { useActivities } from '../composables/useActivities'
import { useToast } from '../composables/useToast'
import { deleteActivity } from '../services/activities.service'

const router = useRouter()
const { activities, loading, error, refresh } = useActivities()
const { success, error: toastError } = useToast()
const filterCategory = ref('')
const deleteTarget = ref<string | null>(null)

const filtered = computed(() =>
  filterCategory.value ? activities.value.filter((a) => a.category === filterCategory.value) : activities.value,
)

const categories = computed(() => [...new Set(activities.value.map((a) => a.category))])

async function confirmDelete() {
  if (!deleteTarget.value) return
  try {
    await deleteActivity(deleteTarget.value)
    success('Activity deleted.')
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
    <ConfirmDialog :open="!!deleteTarget" title="Delete Activity" message="Delete this activity?" danger @confirm="confirmDelete" @cancel="deleteTarget = null" />

    <div class="space-y-6">
      <div class="flex items-center justify-between flex-wrap gap-3">
        <h1 class="text-2xl font-bold text-gray-900">Activities</h1>
        <router-link to="/activities/new" class="inline-flex items-center gap-2 px-4 py-2 bg-green-700 hover:bg-green-800 text-white text-sm font-medium rounded-lg transition-colors">
          <i class="ri-add-line" /> New Activity
        </router-link>
      </div>

      <select v-model="filterCategory" class="w-56 px-3 py-2 rounded-lg border border-gray-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500">
        <option value="">All Categories</option>
        <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
      </select>

      <AlertBanner v-if="error" :message="error" type="error" />
      <LoadingSpinner v-else-if="loading" />

      <div v-else class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
        <div v-if="filtered.length === 0" class="px-6 py-12 text-center text-gray-400 text-sm">No activities.</div>
        <table v-else class="w-full text-sm">
          <thead class="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th class="px-4 py-3 text-left">Category</th>
              <th class="px-4 py-3 text-left">Title</th>
              <th class="px-4 py-3 text-left">Schedule</th>
              <th class="px-4 py-3 text-left">Location</th>
              <th class="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="a in filtered" :key="a.id" class="hover:bg-gray-50">
              <td class="px-4 py-3 text-gray-600 text-xs">{{ a.category }}</td>
              <td class="px-4 py-3 font-medium text-gray-800">{{ a.title }}</td>
              <td class="px-4 py-3 text-gray-500 text-xs">{{ a.schedule }}</td>
              <td class="px-4 py-3 text-gray-500 text-xs">{{ a.location }}</td>
              <td class="px-4 py-3 text-right">
                <div class="flex justify-end gap-2">
                  <button class="p-1.5 rounded text-gray-400 hover:text-green-700 hover:bg-green-50" @click="router.push(`/activities/${a.id}/edit`)"><i class="ri-edit-line text-base" /></button>
                  <button class="p-1.5 rounded text-gray-400 hover:text-red-600 hover:bg-red-50" @click="deleteTarget = a.id"><i class="ri-delete-bin-line text-base" /></button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </AdminLayout>
</template>

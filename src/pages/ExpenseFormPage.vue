<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminLayout from '../layouts/AdminLayout.vue'
import AlertBanner from '../components/AlertBanner.vue'
import { useProjects } from '../composables/useProjects'
import { useExpenses } from '../composables/useExpenses'
import { createExpense, updateExpense } from '../services/expenses.service'

const route = useRoute()
const router = useRouter()
const { projects } = useProjects()
const { expenses, refresh } = useExpenses()

const isEdit = computed(() => !!route.params.id)
const editId = computed(() => route.params.id as string | undefined)
const form = ref({ projectId: (route.query.projectId as string) ?? '', item: '', amount: 0, date: '', receiptLink: '', note: '' })

watch(editId, (id) => {
  if (!id) return
  const e = expenses.value.find((x) => x.id === id)
  if (e) form.value = { projectId: e.projectId, item: e.item, amount: e.amount, date: e.date, receiptLink: e.receiptLink ?? '', note: e.note ?? '' }
}, { immediate: true })

const loading = ref(false)
const submitError = ref<string | null>(null)

async function handleSubmit() {
  submitError.value = null
  loading.value = true
  try {
    if (isEdit.value && editId.value) await updateExpense(editId.value, form.value)
    else await createExpense(form.value)
    refresh()
    router.push('/expenses')
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
        <h1 class="text-2xl font-bold text-gray-900">{{ isEdit ? 'Edit Expense' : 'New Expense' }}</h1>
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
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Item description <span class="text-red-500">*</span></label>
          <input v-model="form.item" type="text" required class="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Roofing materials" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Amount (USD) <span class="text-red-500">*</span></label>
          <input v-model.number="form.amount" type="number" min="0" step="0.01" required class="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Date <span class="text-red-500">*</span></label>
          <input v-model="form.date" type="date" required class="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Receipt Link</label>
          <input v-model="form.receiptLink" type="url" class="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="https://drive.google.com/..." />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Note</label>
          <input v-model="form.note" type="text" class="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
        </div>

        <div class="flex gap-3 pt-2">
          <button type="button" class="px-4 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50" @click="router.back()">Cancel</button>
          <button type="submit" :disabled="loading" class="flex-1 py-2.5 bg-green-700 hover:bg-green-800 disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition-colors">
            {{ loading ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Expense' }}
          </button>
        </div>
      </form>
    </div>
  </AdminLayout>
</template>

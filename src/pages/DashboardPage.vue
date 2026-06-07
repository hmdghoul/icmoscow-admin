<script setup lang="ts">
import { computed } from 'vue'
import AdminLayout from '../layouts/AdminLayout.vue'
import StatCard from '../components/StatCard.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import ToastContainer from '../components/ToastContainer.vue'
import { useProjects } from '../composables/useProjects'
import { useDonations } from '../composables/useDonations'
import { useExpenses } from '../composables/useExpenses'
import { useActivities } from '../composables/useActivities'
import { formatCurrency, formatDate } from '../utils/format'

const { projects, loading: loadingProjects } = useProjects()
const { donations, loading: loadingDonations } = useDonations()
const { expenses, loading: loadingExpenses } = useExpenses()
const { activities } = useActivities()

const totalRaised = computed(() => donations.value.reduce((s, d) => s + d.amount, 0))
const totalExpenses = computed(() => expenses.value.reduce((s, e) => s + e.amount, 0))
const activeProjects = computed(() => projects.value.filter((p) => p.status === 'active').length)

const recentDonations = computed(() =>
  [...donations.value]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5),
)

const loading = computed(() => loadingProjects.value || loadingDonations.value || loadingExpenses.value)
</script>

<template>
  <AdminLayout>
    <ToastContainer />
    <div class="space-y-6">
      <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>

      <LoadingSpinner v-if="loading" />

      <template v-else>
        <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard label="Total Projects" :value="projects.length" icon="ri-folder-3-line" />
          <StatCard label="Active Projects" :value="activeProjects" icon="ri-rocket-line" color="bg-blue-100 text-blue-700" />
          <StatCard label="Total Raised" :value="formatCurrency(totalRaised)" icon="ri-heart-line" color="bg-green-100 text-green-700" />
          <StatCard label="Total Expenses" :value="formatCurrency(totalExpenses)" icon="ri-receipt-line" color="bg-yellow-100 text-yellow-700" />
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          <StatCard label="Donations" :value="donations.length" icon="ri-hand-coin-line" />
          <StatCard label="Activities" :value="activities.length" icon="ri-calendar-event-line" color="bg-purple-100 text-purple-700" />
          <StatCard label="Expenses Recorded" :value="expenses.length" icon="ri-file-list-line" color="bg-orange-100 text-orange-700" />
        </div>

        <!-- Recent Donations -->
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 class="font-semibold text-gray-800">Recent Donations</h2>
            <router-link to="/donations" class="text-sm text-green-600 hover:text-green-700 font-medium">
              View all
            </router-link>
          </div>
          <div v-if="recentDonations.length === 0" class="px-6 py-8 text-center text-gray-400 text-sm">
            No donations yet.
          </div>
          <table v-else class="w-full text-sm">
            <thead class="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
              <tr>
                <th class="px-6 py-3 text-left">Source</th>
                <th class="px-6 py-3 text-left">Amount</th>
                <th class="px-6 py-3 text-left">Date</th>
                <th class="px-6 py-3 text-left">Note</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="d in recentDonations" :key="d.id" class="hover:bg-gray-50">
                <td class="px-6 py-3 text-gray-700 font-medium">{{ d.source }}</td>
                <td class="px-6 py-3 text-gray-700">{{ formatCurrency(d.amount) }}</td>
                <td class="px-6 py-3 text-gray-500">{{ formatDate(d.date) }}</td>
                <td class="px-6 py-3 text-gray-500 truncate max-w-xs">{{ d.note }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </div>
  </AdminLayout>
</template>

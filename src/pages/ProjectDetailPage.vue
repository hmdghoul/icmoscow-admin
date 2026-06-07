<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminLayout from '../layouts/AdminLayout.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import StatusBadge from '../components/StatusBadge.vue'
import ToastContainer from '../components/ToastContainer.vue'
import { useProjects } from '../composables/useProjects'
import { useDonations } from '../composables/useDonations'
import { useExpenses } from '../composables/useExpenses'
import { useTimeline } from '../composables/useTimeline'
import { usePhotos } from '../composables/usePhotos'
import { formatCurrency, formatDate } from '../utils/format'
import { resolveImageUrl } from '../utils/image'

const route = useRoute()
const router = useRouter()
const projectId = route.params.id as string

const { projects, loading: loadingProjects } = useProjects()
const { donations } = useDonations()
const { expenses } = useExpenses()
const { timeline } = useTimeline()
const { photos } = usePhotos()

const project = computed(() => projects.value.find((p) => p.id === projectId))
const projectDonations = computed(() => donations.value.filter((d) => d.projectId === projectId))
const projectExpenses = computed(() => expenses.value.filter((e) => e.projectId === projectId))
const projectTimeline = computed(() => timeline.value.filter((t) => t.projectId === projectId))
const projectPhotos = computed(() => photos.value.filter((p) => p.projectId === projectId))

const activeTab = ref<'donations' | 'expenses' | 'timeline' | 'photos'>('donations')
</script>

<template>
  <AdminLayout>
    <ToastContainer />
    <div class="space-y-6">
      <div class="flex items-center gap-3">
        <button class="text-gray-400 hover:text-gray-600" @click="router.back()">
          <i class="ri-arrow-left-line text-xl" />
        </button>
        <h1 class="text-2xl font-bold text-gray-900">Project Detail</h1>
      </div>

      <LoadingSpinner v-if="loadingProjects" />

      <div v-else-if="!project" class="text-gray-400 text-center py-12">Project not found.</div>

      <template v-else>
        <!-- Project card -->
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div class="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div class="flex items-center gap-3 mb-2">
                <StatusBadge :status="project.status" />
                <span class="font-mono text-xs text-gray-400">{{ project.id }}</span>
              </div>
              <h2 class="text-xl font-bold text-gray-900">{{ project.title }}</h2>
              <p class="mt-2 text-gray-600 text-sm whitespace-pre-wrap" dir="auto">{{ project.shortDescription }}</p>
            </div>
            <button
              class="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
              @click="router.push(`/projects/${project.id}/edit`)"
            >
              <i class="ri-edit-line" /> Edit
            </button>
          </div>

          <div class="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
            <div>
              <p class="text-xs text-gray-500">Goal</p>
              <p class="text-lg font-bold text-gray-800">{{ formatCurrency(project.goal) }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500">Raised</p>
              <p class="text-lg font-bold text-green-700">{{ formatCurrency(project.raised) }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500">Remaining</p>
              <p class="text-lg font-bold" :class="project.remaining < 0 ? 'text-green-700' : 'text-gray-800'">
                {{ formatCurrency(Math.abs(project.remaining)) }}
                <span v-if="project.remaining < 0" class="text-xs font-normal text-green-600">(exceeded)</span>
              </p>
            </div>
          </div>
        </div>

        <!-- Tabs -->
        <div class="border-b border-gray-200 flex gap-6 overflow-x-auto">
          <button
            v-for="tab in (['donations', 'expenses', 'timeline', 'photos'] as const)"
            :key="tab"
            :class="[
              'pb-3 text-sm font-medium capitalize whitespace-nowrap border-b-2 transition-colors',
              activeTab === tab
                ? 'border-green-600 text-green-700'
                : 'border-transparent text-gray-500 hover:text-gray-700',
            ]"
            @click="activeTab = tab"
          >
            {{ tab }}
          </button>
        </div>

        <!-- Donations tab -->
        <div v-if="activeTab === 'donations'">
          <div class="flex justify-end mb-3">
            <router-link
              :to="`/donations/new?projectId=${projectId}`"
              class="inline-flex items-center gap-2 px-4 py-2 bg-green-700 text-white text-sm font-medium rounded-lg hover:bg-green-800 transition-colors"
            >
              <i class="ri-add-line" /> Add Donation
            </router-link>
          </div>
          <div v-if="projectDonations.length === 0" class="text-gray-400 text-center py-8 text-sm">No donations.</div>
          <div v-else class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <table class="w-full text-sm">
              <thead class="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>
                  <th class="px-4 py-3 text-left">Source</th>
                  <th class="px-4 py-3 text-right">Amount</th>
                  <th class="px-4 py-3 text-left">Date</th>
                  <th class="px-4 py-3 text-left">Note</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="d in projectDonations" :key="d.id" class="hover:bg-gray-50">
                  <td class="px-4 py-3 font-medium text-gray-700">{{ d.source }}</td>
                  <td class="px-4 py-3 text-right text-gray-700">{{ formatCurrency(d.amount) }}</td>
                  <td class="px-4 py-3 text-gray-500">{{ formatDate(d.date) }}</td>
                  <td class="px-4 py-3 text-gray-500">{{ d.note }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Photos tab -->
        <div v-if="activeTab === 'photos'">
          <div class="flex justify-end mb-3">
            <router-link
              :to="`/photos/new?projectId=${projectId}`"
              class="inline-flex items-center gap-2 px-4 py-2 bg-green-700 text-white text-sm font-medium rounded-lg hover:bg-green-800 transition-colors"
            >
              <i class="ri-add-line" /> Add Photo
            </router-link>
          </div>
          <div v-if="projectPhotos.length === 0" class="text-gray-400 text-center py-8 text-sm">No photos.</div>
          <div v-else class="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div v-for="p in projectPhotos" :key="p.id" class="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <img :src="resolveImageUrl(p.imageLink)" :alt="p.caption" class="w-full h-40 object-cover" />
              <div class="p-3">
                <span class="text-xs font-medium px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">{{ p.type }}</span>
                <p v-if="p.caption" class="text-xs text-gray-500 mt-1">{{ p.caption }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Expenses tab (simplified) -->
        <div v-if="activeTab === 'expenses'">
          <div class="flex justify-end mb-3">
            <router-link :to="`/expenses/new?projectId=${projectId}`" class="inline-flex items-center gap-2 px-4 py-2 bg-green-700 text-white text-sm font-medium rounded-lg hover:bg-green-800 transition-colors">
              <i class="ri-add-line" /> Add Expense
            </router-link>
          </div>
          <div v-if="projectExpenses.length === 0" class="text-gray-400 text-center py-8 text-sm">No expenses.</div>
          <div v-else class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <table class="w-full text-sm">
              <thead class="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>
                  <th class="px-4 py-3 text-left">Item</th>
                  <th class="px-4 py-3 text-right">Amount</th>
                  <th class="px-4 py-3 text-left">Date</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="e in projectExpenses" :key="e.id" class="hover:bg-gray-50">
                  <td class="px-4 py-3 font-medium text-gray-700">{{ e.item }}</td>
                  <td class="px-4 py-3 text-right text-gray-700">{{ formatCurrency(e.amount) }}</td>
                  <td class="px-4 py-3 text-gray-500">{{ formatDate(e.date) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Timeline tab (simplified) -->
        <div v-if="activeTab === 'timeline'">
          <div class="flex justify-end mb-3">
            <router-link :to="`/timeline/new?projectId=${projectId}`" class="inline-flex items-center gap-2 px-4 py-2 bg-green-700 text-white text-sm font-medium rounded-lg hover:bg-green-800 transition-colors">
              <i class="ri-add-line" /> Add Entry
            </router-link>
          </div>
          <div v-if="projectTimeline.length === 0" class="text-gray-400 text-center py-8 text-sm">No timeline entries.</div>
          <div v-else class="space-y-3">
            <div v-for="t in projectTimeline" :key="t.id" class="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <div class="flex items-center justify-between mb-1">
                <h3 class="font-semibold text-gray-800">{{ t.title }}</h3>
                <span class="text-xs text-gray-400">{{ formatDate(t.date) }}</span>
              </div>
              <p class="text-sm text-gray-600">{{ t.update }}</p>
            </div>
          </div>
        </div>
      </template>
    </div>
  </AdminLayout>
</template>

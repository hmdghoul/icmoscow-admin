<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminLayout from '../layouts/AdminLayout.vue'
import AlertBanner from '../components/AlertBanner.vue'
import { useProjects } from '../composables/useProjects'
import { fetchProject, createProject, updateProject } from '../services/projects.service'
import { slugify } from '../utils/format'
import { resolveImageUrl } from '../utils/image'
import type { Project } from '../types'

const route = useRoute()
const router = useRouter()
const { refresh } = useProjects()

const isEdit = computed(() => !!route.params.id)
const id = computed(() => route.params.id as string | undefined)

const form = ref({
  id: '',
  title: '',
  status: 'active' as Project['status'],
  shortDescription: '',
  goal: 0,
  gofundmeLink: '',
  coverImage: '',
})

const loading = ref(false)
const fetchError = ref<string | null>(null)
const submitError = ref<string | null>(null)
const titleTouched = ref(false)

// In create mode, auto-fill ID from title
watch(
  () => form.value.title,
  (title) => {
    if (!isEdit.value && !titleTouched.value) {
      form.value.id = slugify(title)
    }
  },
)

// Load existing project for edit mode
watch(
  id,
  async (newId) => {
    if (!newId) return
    loading.value = true
    try {
      const p = await fetchProject(newId)
      form.value = {
        id: p.id,
        title: p.title,
        status: p.status,
        shortDescription: p.shortDescription,
        goal: p.goal,
        gofundmeLink: p.gofundmeLink ?? '',
        coverImage: p.coverImage ?? '',
      }
    } catch {
      fetchError.value = 'Project not found.'
    } finally {
      loading.value = false
    }
  },
  { immediate: true },
)

async function handleSubmit() {
  submitError.value = null
  loading.value = true
  try {
    if (isEdit.value && id.value) {
      await updateProject(id.value, {
        title: form.value.title,
        status: form.value.status,
        shortDescription: form.value.shortDescription,
        goal: form.value.goal,
        gofundmeLink: form.value.gofundmeLink || undefined,
        coverImage: form.value.coverImage || undefined,
      })
    } else {
      await createProject({
        id: form.value.id,
        title: form.value.title,
        status: form.value.status,
        shortDescription: form.value.shortDescription,
        goal: form.value.goal,
        gofundmeLink: form.value.gofundmeLink || undefined,
        coverImage: form.value.coverImage || undefined,
      })
    }
    refresh()
    router.push('/projects')
  } catch (e) {
    submitError.value = e instanceof Error ? e.message : 'Failed to save project.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <AdminLayout>
    <div class="max-w-2xl mx-auto space-y-6">
      <div class="flex items-center gap-3">
        <button class="text-gray-400 hover:text-gray-600" @click="router.back()">
          <i class="ri-arrow-left-line text-xl" />
        </button>
        <h1 class="text-2xl font-bold text-gray-900">
          {{ isEdit ? 'Edit Project' : 'New Project' }}
        </h1>
      </div>

      <AlertBanner v-if="fetchError" :message="fetchError" type="error" />

      <form v-else class="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-5" @submit.prevent="handleSubmit">
        <AlertBanner v-if="submitError" :message="submitError" type="error" />

        <!-- ID (readonly in edit mode) -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">
            Project ID <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.id"
            type="text"
            :readonly="isEdit"
            :class="[
              'w-full px-3.5 py-2.5 rounded-lg border text-sm font-mono focus:outline-none focus:ring-2 focus:ring-green-500',
              isEdit ? 'bg-gray-50 text-gray-500 border-gray-200 cursor-default' : 'border-gray-300',
            ]"
            required
            placeholder="e.g. roof-repair"
            @input="titleTouched = true"
          />
          <p class="mt-1 text-xs text-gray-500">Auto-generated from title. Use lowercase letters, numbers, and hyphens only.</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Title <span class="text-red-500">*</span></label>
          <input
            v-model="form.title"
            type="text"
            required
            class="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Roof Replacement Project"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Status <span class="text-red-500">*</span></label>
          <select
            v-model="form.status"
            required
            class="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
          >
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="future">Future</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Description <span class="text-red-500">*</span></label>
          <textarea
            v-model="form.shortDescription"
            dir="auto"
            rows="4"
            required
            class="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            placeholder="Describe the project goal and status…"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Goal (USD)</label>
          <input
            v-model.number="form.goal"
            type="number"
            min="0"
            step="0.01"
            class="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="35000"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">GoFundMe Link</label>
          <input
            v-model="form.gofundmeLink"
            type="url"
            class="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="https://www.gofundme.com/f/..."
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Cover Image URL</label>
          <input
            v-model="form.coverImage"
            type="url"
            class="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="https://drive.google.com/uc?export=view&id=..."
          />
          <div v-if="form.coverImage" class="mt-2">
            <img
              :src="resolveImageUrl(form.coverImage)"
              alt="Cover preview"
              class="h-32 w-full object-cover rounded-lg border border-gray-200"
              @error="($event.target as HTMLImageElement).style.display = 'none'"
            />
          </div>
        </div>

        <div class="flex gap-3 pt-2">
          <button
            type="button"
            class="px-4 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            @click="router.back()"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="flex-1 py-2.5 px-4 bg-green-700 hover:bg-green-800 disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            {{ loading ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Project' }}
          </button>
        </div>
      </form>
    </div>
  </AdminLayout>
</template>

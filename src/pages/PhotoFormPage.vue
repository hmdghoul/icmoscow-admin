<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminLayout from '../layouts/AdminLayout.vue'
import AlertBanner from '../components/AlertBanner.vue'
import { useProjects } from '../composables/useProjects'
import { usePhotos } from '../composables/usePhotos'
import { createPhoto, updatePhoto, uploadImage } from '../services/photos.service'
import { resolveImageUrl } from '../utils/image'
import { PHOTO_TYPES } from '../types'

const route = useRoute()
const router = useRouter()
const { projects } = useProjects()
const { photos, refresh } = usePhotos()

const isEdit = computed(() => !!route.params.id)
const editId = computed(() => route.params.id as string | undefined)
const form = ref({ projectId: (route.query.projectId as string) ?? '', type: 'progress' as 'progress' | 'cover' | 'update', imageLink: '', caption: '' })

watch(editId, (id) => {
  if (!id) return
  const p = photos.value.find((x) => x.id === id)
  if (p) form.value = { projectId: p.projectId, type: p.type, imageLink: p.imageLink, caption: p.caption ?? '' }
}, { immediate: true })

const uploading = ref(false)
const uploadError = ref<string | null>(null)
const loading = ref(false)
const submitError = ref<string | null>(null)

async function handleFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  uploading.value = true
  uploadError.value = null
  try {
    form.value.imageLink = await uploadImage(file)
  } catch (err) {
    uploadError.value = err instanceof Error ? err.message : 'Upload failed.'
  } finally {
    uploading.value = false
  }
}

async function handleSubmit() {
  submitError.value = null
  loading.value = true
  try {
    const payload = { ...form.value, caption: form.value.caption || undefined }
    if (isEdit.value && editId.value) await updatePhoto(editId.value, payload)
    else await createPhoto(payload)
    refresh()
    router.push('/photos')
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
        <h1 class="text-2xl font-bold text-gray-900">{{ isEdit ? 'Edit Photo' : 'Upload Photo' }}</h1>
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
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Type <span class="text-red-500">*</span></label>
          <select v-model="form.type" class="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500">
            <option v-for="t in PHOTO_TYPES" :key="t" :value="t">{{ t }}</option>
          </select>
        </div>

        <!-- File upload -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Image File</label>
          <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
            <input type="file" accept="image/*,.pdf" class="hidden" id="file-input" @change="handleFileChange" />
            <label for="file-input" class="cursor-pointer flex flex-col items-center gap-2">
              <i class="ri-upload-cloud-2-line text-3xl text-gray-400" />
              <span class="text-sm text-gray-500">Click to upload or drag and drop</span>
              <span class="text-xs text-gray-400">JPG, PNG, WebP, GIF, PDF</span>
            </label>
          </div>
          <AlertBanner v-if="uploadError" :message="uploadError" type="error" class="mt-2" />
          <p v-if="uploading" class="text-sm text-gray-500 mt-2 flex items-center gap-2">
            <i class="ri-loader-4-line animate-spin" /> Uploading to Google Drive…
          </p>
        </div>

        <!-- Or paste URL -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Or paste image URL</label>
          <input v-model="form.imageLink" type="url" class="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="https://drive.google.com/uc?export=view&id=..." />
          <div v-if="form.imageLink" class="mt-2">
            <img :src="resolveImageUrl(form.imageLink)" alt="Preview" class="h-32 w-full object-cover rounded-lg border border-gray-200" @error="($event.target as HTMLImageElement).style.display = 'none'" />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Caption</label>
          <input v-model="form.caption" type="text" class="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Roof installation in progress" />
        </div>

        <div class="flex gap-3 pt-2">
          <button type="button" class="px-4 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50" @click="router.back()">Cancel</button>
          <button type="submit" :disabled="loading || uploading || !form.imageLink" class="flex-1 py-2.5 bg-green-700 hover:bg-green-800 disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition-colors">
            {{ loading ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Photo' }}
          </button>
        </div>
      </form>
    </div>
  </AdminLayout>
</template>

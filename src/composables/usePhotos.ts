import { ref } from 'vue'
import type { Photo } from '../types'
import { fetchPhotos } from '../services/photos.service'

const photosRef = ref<Photo[]>([])
const loadingRef = ref(true)
const errorRef = ref<string | null>(null)
let fetchPromise: Promise<void> | null = null

function load(): void {
  if (fetchPromise !== null) return
  fetchPromise = fetchPhotos()
    .then((data) => {
      photosRef.value = data
    })
    .catch(() => {
      errorRef.value = 'Failed to load photos.'
    })
    .finally(() => {
      loadingRef.value = false
    })
}

export function usePhotos() {
  load()

  function refresh(): void {
    fetchPromise = null
    loadingRef.value = true
    errorRef.value = null
    load()
  }

  return {
    photos: photosRef,
    loading: loadingRef,
    error: errorRef,
    refresh,
  }
}

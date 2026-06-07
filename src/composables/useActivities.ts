import { ref } from 'vue'
import type { Activity } from '../types'
import { fetchActivities } from '../services/activities.service'

const activitiesRef = ref<Activity[]>([])
const loadingRef = ref(true)
const errorRef = ref<string | null>(null)
let fetchPromise: Promise<void> | null = null

function load(): void {
  if (fetchPromise !== null) return
  fetchPromise = fetchActivities()
    .then((data) => {
      activitiesRef.value = data
    })
    .catch(() => {
      errorRef.value = 'Failed to load activities.'
    })
    .finally(() => {
      loadingRef.value = false
    })
}

export function useActivities() {
  load()

  function refresh(): void {
    fetchPromise = null
    loadingRef.value = true
    errorRef.value = null
    load()
  }

  return {
    activities: activitiesRef,
    loading: loadingRef,
    error: errorRef,
    refresh,
  }
}

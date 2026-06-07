import { ref } from 'vue'
import type { TimelineEntry } from '../types'
import { fetchTimeline } from '../services/timeline.service'

const timelineRef = ref<TimelineEntry[]>([])
const loadingRef = ref(true)
const errorRef = ref<string | null>(null)
let fetchPromise: Promise<void> | null = null

function load(): void {
  if (fetchPromise !== null) return
  fetchPromise = fetchTimeline()
    .then((data) => {
      timelineRef.value = data
    })
    .catch(() => {
      errorRef.value = 'Failed to load timeline.'
    })
    .finally(() => {
      loadingRef.value = false
    })
}

export function useTimeline() {
  load()

  function refresh(): void {
    fetchPromise = null
    loadingRef.value = true
    errorRef.value = null
    load()
  }

  return {
    timeline: timelineRef,
    loading: loadingRef,
    error: errorRef,
    refresh,
  }
}

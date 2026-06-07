import { ref } from 'vue'
import type { Project } from '../types'
import { fetchProjects } from '../services/projects.service'

const projectsRef = ref<Project[]>([])
const loadingRef = ref(true)
const errorRef = ref<string | null>(null)
let fetchPromise: Promise<void> | null = null

function load(): void {
  if (fetchPromise !== null) return
  fetchPromise = fetchProjects()
    .then((data) => {
      projectsRef.value = data
    })
    .catch(() => {
      errorRef.value = 'Failed to load projects.'
    })
    .finally(() => {
      loadingRef.value = false
    })
}

export function useProjects() {
  load()

  function refresh(): void {
    fetchPromise = null
    loadingRef.value = true
    errorRef.value = null
    load()
  }

  return {
    projects: projectsRef,
    loading: loadingRef,
    error: errorRef,
    refresh,
  }
}

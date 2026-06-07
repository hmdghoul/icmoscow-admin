import { ref } from 'vue'
import type { Donation } from '../types'
import { fetchDonations } from '../services/donations.service'

const donationsRef = ref<Donation[]>([])
const loadingRef = ref(true)
const errorRef = ref<string | null>(null)
let fetchPromise: Promise<void> | null = null

function load(): void {
  if (fetchPromise !== null) return
  fetchPromise = fetchDonations()
    .then((data) => {
      donationsRef.value = data
    })
    .catch(() => {
      errorRef.value = 'Failed to load donations.'
    })
    .finally(() => {
      loadingRef.value = false
    })
}

export function useDonations() {
  load()

  function refresh(): void {
    fetchPromise = null
    loadingRef.value = true
    errorRef.value = null
    load()
  }

  return {
    donations: donationsRef,
    loading: loadingRef,
    error: errorRef,
    refresh,
  }
}

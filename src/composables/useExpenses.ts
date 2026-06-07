import { ref } from 'vue'
import type { Expense } from '../types'
import { fetchExpenses } from '../services/expenses.service'

const expensesRef = ref<Expense[]>([])
const loadingRef = ref(true)
const errorRef = ref<string | null>(null)
let fetchPromise: Promise<void> | null = null

function load(): void {
  if (fetchPromise !== null) return
  fetchPromise = fetchExpenses()
    .then((data) => {
      expensesRef.value = data
    })
    .catch(() => {
      errorRef.value = 'Failed to load expenses.'
    })
    .finally(() => {
      loadingRef.value = false
    })
}

export function useExpenses() {
  load()

  function refresh(): void {
    fetchPromise = null
    loadingRef.value = true
    errorRef.value = null
    load()
  }

  return {
    expenses: expensesRef,
    loading: loadingRef,
    error: errorRef,
    refresh,
  }
}

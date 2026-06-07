import type { Expense, CreateExpensePayload, UpdateExpensePayload } from '../types'
import { apiFetch, formatApiError } from '../helpers/api'

export async function fetchExpenses(projectId?: string): Promise<Expense[]> {
  const qs = projectId ? `?projectId=${encodeURIComponent(projectId)}` : ''
  const res = await apiFetch(`/api/expenses${qs}`)
  if (!res.ok) throw new Error(`Failed to fetch expenses: ${res.status}`)
  return res.json()
}

export async function createExpense(payload: CreateExpensePayload): Promise<Expense> {
  const res = await apiFetch('/api/expenses', { method: 'POST', body: JSON.stringify(payload) })
  const body = await res.json()
  if (!res.ok) throw new Error(formatApiError(res, body))
  return body
}

export async function updateExpense(id: string, payload: UpdateExpensePayload): Promise<Expense> {
  const res = await apiFetch(`/api/expenses/${id}`, { method: 'PUT', body: JSON.stringify(payload) })
  const body = await res.json()
  if (!res.ok) throw new Error(formatApiError(res, body))
  return body
}

export async function deleteExpense(id: string): Promise<void> {
  const res = await apiFetch(`/api/expenses/${id}`, { method: 'DELETE' })
  if (!res.ok) {
    const body = await res.json()
    throw new Error(formatApiError(res, body))
  }
}

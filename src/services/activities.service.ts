import type { Activity, CreateActivityPayload, UpdateActivityPayload } from '../types'
import { apiFetch, formatApiError } from '../helpers/api'

export async function fetchActivities(): Promise<Activity[]> {
  const res = await apiFetch('/api/activities')
  if (!res.ok) throw new Error(`Failed to fetch activities: ${res.status}`)
  return res.json()
}

export async function createActivity(payload: CreateActivityPayload): Promise<Activity> {
  const res = await apiFetch('/api/activities', { method: 'POST', body: JSON.stringify(payload) })
  const body = await res.json()
  if (!res.ok) throw new Error(formatApiError(res, body))
  return body
}

export async function updateActivity(id: string, payload: UpdateActivityPayload): Promise<Activity> {
  const res = await apiFetch(`/api/activities/${id}`, { method: 'PUT', body: JSON.stringify(payload) })
  const body = await res.json()
  if (!res.ok) throw new Error(formatApiError(res, body))
  return body
}

export async function deleteActivity(id: string): Promise<void> {
  const res = await apiFetch(`/api/activities/${id}`, { method: 'DELETE' })
  if (!res.ok) {
    const body = await res.json()
    throw new Error(formatApiError(res, body))
  }
}

import type { TimelineEntry, CreateTimelinePayload, UpdateTimelinePayload } from '../types'
import { apiFetch, formatApiError } from '../helpers/api'

export async function fetchTimeline(projectId?: string): Promise<TimelineEntry[]> {
  const qs = projectId ? `?projectId=${encodeURIComponent(projectId)}` : ''
  const res = await apiFetch(`/api/timeline${qs}`)
  if (!res.ok) throw new Error(`Failed to fetch timeline: ${res.status}`)
  return res.json()
}

export async function createTimelineEntry(payload: CreateTimelinePayload): Promise<TimelineEntry> {
  const res = await apiFetch('/api/timeline', { method: 'POST', body: JSON.stringify(payload) })
  const body = await res.json()
  if (!res.ok) throw new Error(formatApiError(res, body))
  return body
}

export async function updateTimelineEntry(id: string, payload: UpdateTimelinePayload): Promise<TimelineEntry> {
  const res = await apiFetch(`/api/timeline/${id}`, { method: 'PUT', body: JSON.stringify(payload) })
  const body = await res.json()
  if (!res.ok) throw new Error(formatApiError(res, body))
  return body
}

export async function deleteTimelineEntry(id: string): Promise<void> {
  const res = await apiFetch(`/api/timeline/${id}`, { method: 'DELETE' })
  if (!res.ok) {
    const body = await res.json()
    throw new Error(formatApiError(res, body))
  }
}

import type { Donation, CreateDonationPayload, UpdateDonationPayload } from '../types'
import { apiFetch, formatApiError } from '../helpers/api'

export async function fetchDonations(projectId?: string): Promise<Donation[]> {
  const qs = projectId ? `?projectId=${encodeURIComponent(projectId)}` : ''
  const res = await apiFetch(`/api/donations${qs}`)
  if (!res.ok) throw new Error(`Failed to fetch donations: ${res.status}`)
  return res.json()
}

export async function createDonation(payload: CreateDonationPayload): Promise<Donation> {
  const res = await apiFetch('/api/donations', { method: 'POST', body: JSON.stringify(payload) })
  const body = await res.json()
  if (!res.ok) throw new Error(formatApiError(res, body))
  return body
}

export async function updateDonation(id: string, payload: UpdateDonationPayload): Promise<Donation> {
  const res = await apiFetch(`/api/donations/${id}`, { method: 'PUT', body: JSON.stringify(payload) })
  const body = await res.json()
  if (!res.ok) throw new Error(formatApiError(res, body))
  return body
}

export async function deleteDonation(id: string): Promise<void> {
  const res = await apiFetch(`/api/donations/${id}`, { method: 'DELETE' })
  if (!res.ok) {
    const body = await res.json()
    throw new Error(formatApiError(res, body))
  }
}

import type { Photo, CreatePhotoPayload, UpdatePhotoPayload } from '../types'
import { apiFetch, apiUpload, formatApiError } from '../helpers/api'

export async function fetchPhotos(projectId?: string): Promise<Photo[]> {
  const qs = projectId ? `?projectId=${encodeURIComponent(projectId)}` : ''
  const res = await apiFetch(`/api/photos${qs}`)
  if (!res.ok) throw new Error(`Failed to fetch photos: ${res.status}`)
  return res.json()
}

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)
  const res = await apiUpload('/api/upload', formData)
  const body = await res.json()
  if (!res.ok) throw new Error(formatApiError(res, body))
  return (body as { url: string }).url
}

export async function createPhoto(payload: CreatePhotoPayload): Promise<Photo> {
  const res = await apiFetch('/api/photos', { method: 'POST', body: JSON.stringify(payload) })
  const body = await res.json()
  if (!res.ok) throw new Error(formatApiError(res, body))
  return body
}

export async function updatePhoto(id: string, payload: UpdatePhotoPayload): Promise<Photo> {
  const res = await apiFetch(`/api/photos/${id}`, { method: 'PUT', body: JSON.stringify(payload) })
  const body = await res.json()
  if (!res.ok) throw new Error(formatApiError(res, body))
  return body
}

export async function deletePhoto(id: string): Promise<void> {
  const res = await apiFetch(`/api/photos/${id}`, { method: 'DELETE' })
  if (!res.ok) {
    const body = await res.json()
    throw new Error(formatApiError(res, body))
  }
}

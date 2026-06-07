import type { Project, CreateProjectPayload, UpdateProjectPayload } from '../types'
import { apiFetch, formatApiError } from '../helpers/api'

export async function fetchProjects(): Promise<Project[]> {
  const res = await apiFetch('/api/projects')
  if (!res.ok) throw new Error(`Failed to fetch projects: ${res.status}`)
  return res.json()
}

export async function fetchProject(id: string): Promise<Project> {
  const res = await apiFetch(`/api/projects/${id}`)
  if (!res.ok) throw new Error(`Project not found`)
  return res.json()
}

export async function createProject(payload: CreateProjectPayload): Promise<Project> {
  const res = await apiFetch('/api/projects', { method: 'POST', body: JSON.stringify(payload) })
  const body = await res.json()
  if (!res.ok) throw new Error(formatApiError(res, body))
  return body
}

export async function updateProject(id: string, payload: UpdateProjectPayload): Promise<Project> {
  const res = await apiFetch(`/api/projects/${id}`, { method: 'PUT', body: JSON.stringify(payload) })
  const body = await res.json()
  if (!res.ok) throw new Error(formatApiError(res, body))
  return body
}

export async function deleteProject(id: string): Promise<void> {
  const res = await apiFetch(`/api/projects/${id}`, { method: 'DELETE' })
  if (!res.ok) {
    const body = await res.json()
    throw new Error(formatApiError(res, body))
  }
}

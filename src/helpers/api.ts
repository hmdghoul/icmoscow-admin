const TOKEN_KEY = 'icm_admin_token'

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}

export async function apiFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const token = getToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}${path}`, {
    ...options,
    headers,
  })

  if (res.status === 401 && token) {
    clearToken()
    window.location.href = '/login'
  }

  return res
}

export async function apiUpload(path: string, formData: FormData): Promise<Response> {
  const token = getToken()
  const headers: Record<string, string> = {}
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}${path}`, {
    method: 'POST',
    headers,
    body: formData,
  })
  if (res.status === 401 && token) {
    clearToken()
    window.location.href = '/login'
  }
  return res
}

export function formatApiError(res: Response, body: unknown): string {
  if (typeof body === 'object' && body !== null && 'error' in body) {
    return String((body as { error: string }).error)
  }
  return `Request failed with status ${res.status}`
}

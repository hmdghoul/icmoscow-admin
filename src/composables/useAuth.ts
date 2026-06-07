import { ref, computed } from 'vue'
import { apiFetch, setToken, clearToken, getToken, formatApiError } from '../helpers/api'
import { router } from '../router'
import type { AuthResponse } from '../types'

const tokenRef = ref<string | null>(getToken())
const loadingRef = ref(false)
const errorRef = ref<string | null>(null)

export function useAuth() {
  async function login(username: string, password: string): Promise<void> {
    loadingRef.value = true
    errorRef.value = null
    try {
      const res = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      })
      const body = await res.json()
      if (!res.ok) {
        errorRef.value = formatApiError(res, body)
        return
      }
      const { token } = body as AuthResponse
      setToken(token)
      tokenRef.value = token
      await router.push('/')
    } catch {
      errorRef.value = 'Unable to connect to the server.'
    } finally {
      loadingRef.value = false
    }
  }

  function logout(): void {
    clearToken()
    tokenRef.value = null
    router.push('/login')
  }

  const isAuthenticated = computed(() => tokenRef.value !== null)

  return {
    login,
    logout,
    isAuthenticated,
    loading: loadingRef,
    error: errorRef,
  }
}

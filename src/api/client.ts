export const API_BASE_URL: string =
  (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'

// The auth token is held in memory here and mirrored to sessionStorage by AuthContext.
let authToken: string | null = null

export function setAuthToken(token: string | null) {
  authToken = token
}
export function getAuthToken(): string | null {
  return authToken
}

// Tracks whether the last data call used mock fallback — surfaced app-wide as a banner.
type FallbackListener = (usingMock: boolean) => void
const fallbackListeners = new Set<FallbackListener>()
export function onFallbackChange(fn: FallbackListener) {
  fallbackListeners.add(fn)
  return () => fallbackListeners.delete(fn)
}
function notifyFallback(usingMock: boolean) {
  fallbackListeners.forEach((fn) => fn(usingMock))
}

interface RequestOptions<T> {
  method?: string
  /** JSON body (object) — will be stringified. Ignored if `formData` is set. */
  body?: unknown
  /** For multipart uploads (driver photos, bulk files). */
  formData?: FormData
  /** Query params appended to the URL. */
  params?: Record<string, string | number | boolean | undefined>
  /** Mock value returned when the backend is unreachable / errors. */
  fallback?: T
  /** Skip auth header (e.g. auth endpoints). */
  noAuth?: boolean
}

function buildUrl(
  path: string,
  params?: RequestOptions<unknown>['params'],
): string {
  const url = new URL(API_BASE_URL + path)
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '')
        url.searchParams.set(k, String(v))
    })
  }
  return url.toString()
}

export async function apiRequest<T>(
  path: string,
  opts: RequestOptions<T> = {},
): Promise<T> {
  const { method = 'GET', body, formData, params, fallback, noAuth } = opts

  const headers: Record<string, string> = {}
  if (!noAuth && authToken) headers['Authorization'] = `Bearer ${authToken}`
  if (body && !formData) headers['Content-Type'] = 'application/json'

  try {
    const res = await fetch(buildUrl(path, params), {
      method,
      headers,
      body: formData ? formData : body ? JSON.stringify(body) : undefined,
    })

    if (!res.ok) {
      // If a fallback is available we treat non-ok as "backend not ready" and mock it.
      if (fallback !== undefined) {
        notifyFallback(true)
        return fallback
      }
      const text = await res.text().catch(() => '')
      throw new ApiError(res.status, text || res.statusText)
    }

    notifyFallback(false)
    const ct = res.headers.get('content-type') || ''
    if (ct.includes('application/json')) return (await res.json()) as T
    return (await res.text()) as unknown as T
  } catch (err) {
    if (err instanceof ApiError) throw err // real HTTP error with no fallback — bubble up
    // Network / CORS / server-down: use mock fallback if provided.
    if (fallback !== undefined) {
      notifyFallback(true)
      return fallback
    }
    throw new ApiError(0, err instanceof Error ? err.message : 'Network error')
  }
}

export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
    this.name = 'ApiError'
  }
}
// client.ts — Direct API Client Wrapper pointing to Spring Boot with /api prefix
export const API_BASE_URL: string =
  (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_API_BASE_URL || 'http://localhost:8080/api'

// The auth token is held in memory here and mirrored to sessionStorage by AuthContext.
let authToken: string | null = null

export function setAuthToken(token: string | null) {
  authToken = token
}
export function getAuthToken(): string | null {
  return authToken
}

/**
 * Compatibility Export to fix AppLayout.tsx/Banner dependencies once and for all.
 * It does nothing, permanently keeping the frontend out of "mock/demo" mode.
 */
type FallbackListener = (usingMock: boolean) => void
export function onFallbackChange(fn: FallbackListener) {
  // Immediately tell any listening layout banners that we are NOT using a mock
  fn(false) 
  return () => {}
}

interface RequestOptions {
  method?: string
  /** JSON body (object) — will be stringified. Ignored if `formData` is set. */
  body?: unknown
  /** For multipart uploads (driver photos, bulk files). */
  formData?: FormData
  /** Query params appended to the URL. */
  params?: Record<string, string | number | boolean | undefined>
  /** Skip auth header (e.g. auth endpoints). */
  noAuth?: boolean
}

function buildUrl(
  path: string,
  params?: RequestOptions['params'],
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
  opts: RequestOptions = {},
): Promise<T> {
  const { method = 'GET', body, formData, params, noAuth } = opts

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
      const text = await res.text().catch(() => '')
      throw new ApiError(res.status, text || res.statusText)
    }

    const ct = res.headers.get('content-type') || ''
    if (ct.includes('application/json')) return (await res.json()) as T
    return (await res.text()) as unknown as T
  } catch (err) {
    if (err instanceof ApiError) throw err // Real HTTP error — bubble up
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
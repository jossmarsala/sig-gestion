import { apiBaseUrl } from './config'
import { ApiError } from './errors'

export type QueryParams = Record<string, string | number | boolean | null | undefined>

export interface ApiRequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown
  query?: QueryParams
  timeoutMs?: number
}

const DEFAULT_TIMEOUT_MS = 15_000

function buildUrl(path: string, query?: QueryParams): string {
  const isAbsolute = /^https?:\/\//i.test(path)
  const base = isAbsolute ? undefined : apiBaseUrl
  const url = new URL(base ? `${base}${path.startsWith('/') ? '' : '/'}${path}` : path)

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined || value === null || value === '') continue
      url.searchParams.set(key, String(value))
    }
  }

  return url.toString()
}

function extractMessage(payload: unknown, fallback: string): string {
  if (typeof payload === 'string' && payload.trim()) return payload
  if (payload && typeof payload === 'object') {
    const record = payload as Record<string, unknown>
    for (const key of ['error', 'mensaje', 'message']) {
      const value = record[key]
      if (typeof value === 'string' && value.trim()) return value
    }
  }
  return fallback
}

/**
 * Thin fetch wrapper used by every feature. It handles base URL, query params,
 * JSON encode/decode, timeouts and error normalization.
 */
export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { body, query, timeoutMs = DEFAULT_TIMEOUT_MS, headers, ...init } = options

  const controller = new AbortController()
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetch(buildUrl(path, query), {
      ...init,
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
        ...headers,
      },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    })

    const contentType = response.headers.get('content-type') ?? ''
    const payload = contentType.includes('application/json')
      ? await response.json().catch(() => null)
      : await response.text().catch(() => null)

    if (!response.ok) {
      throw new ApiError(extractMessage(payload, `La solicitud falló (HTTP ${response.status}).`), {
        status: response.status,
        payload,
      })
    }

    return payload as T
  } catch (error) {
    if (error instanceof ApiError) throw error

    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ApiError('La solicitud tardó demasiado. Verificá que el backend esté corriendo.', {
        isNetworkError: true,
        payload: error,
      })
    }

    throw new ApiError(
      `No se pudo conectar con la API en ${apiBaseUrl}. Verificá que el backend esté corriendo.`,
      { isNetworkError: true, payload: error }
    )
  } finally {
    window.clearTimeout(timeoutId)
  }
}

export const api = {
  get: <T>(path: string, options?: Omit<ApiRequestOptions, 'body' | 'method'>) =>
    apiRequest<T>(path, { ...options, method: 'GET' }),

  post: <T>(path: string, body: unknown, options?: Omit<ApiRequestOptions, 'body' | 'method'>) =>
    apiRequest<T>(path, { ...options, method: 'POST', body }),

  put: <T>(path: string, body: unknown, options?: Omit<ApiRequestOptions, 'body' | 'method'>) =>
    apiRequest<T>(path, { ...options, method: 'PUT', body }),

  patch: <T>(path: string, body: unknown, options?: Omit<ApiRequestOptions, 'body' | 'method'>) =>
    apiRequest<T>(path, { ...options, method: 'PATCH', body }),

  delete: <T>(path: string, options?: Omit<ApiRequestOptions, 'body' | 'method'>) =>
    apiRequest<T>(path, { ...options, method: 'DELETE' }),
}

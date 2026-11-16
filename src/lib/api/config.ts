/**
 * Data source configuration.
 *
 * The whole app talks to the backend through `@/lib/api/client`. Which
 * implementation answers those calls is decided here, at a single point:
 *
 *   VITE_DATA_SOURCE=mock  -> MSW intercepts fetch and serves DB-shaped fixtures
 *   VITE_DATA_SOURCE=api   -> requests hit VITE_API_URL (Express + Supabase)
 *
 * The value can be overridden at runtime (without rebuilding) from the browser
 * console or the dev badge in the sidebar:
 *
 *   window.aguamarinaDataSource.set('api')   // reloads the page
 *   window.aguamarinaDataSource.clear()      // back to the .env value
 */
export type DataSource = 'api' | 'mock'

const STORAGE_KEY = 'aguamarina:data-source'

function normalizeDataSource(value: string | null | undefined): DataSource | null {
  if (!value) return null

  const normalized = value.trim().toLowerCase()
  if (normalized === 'api' || normalized === 'real' || normalized === 'db') return 'api'
  if (normalized === 'mock' || normalized === 'simulated' || normalized === 'sim') return 'mock'
  return null
}

function readStoredDataSource(): DataSource | null {
  try {
    return normalizeDataSource(window.localStorage.getItem(STORAGE_KEY))
  } catch {
    return null
  }
}

/** Value declared in `.env`. Falls back to mock in dev and api in production. */
export const defaultDataSource: DataSource =
  normalizeDataSource(import.meta.env.VITE_DATA_SOURCE) ?? (import.meta.env.DEV ? 'mock' : 'api')

/** Effective source: runtime override > `.env` value. */
export const dataSource: DataSource = readStoredDataSource() ?? defaultDataSource

export const isMockMode = dataSource === 'mock'

/** Express origin, without the `/api` prefix (routes already include it). */
export const apiBaseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3001').replace(/\/+$/, '')

/** Artificial latency for simulated responses, in ms. */
export const mockLatencyMs = Math.max(0, Number(import.meta.env.VITE_MOCK_LATENCY_MS ?? 350) || 0)

export function setDataSource(next: DataSource): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, next)
  } catch {
    // localStorage can be unavailable (private mode); the reload still applies nothing.
  }
  window.location.reload()
}

export function clearDataSourceOverride(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
  window.location.reload()
}

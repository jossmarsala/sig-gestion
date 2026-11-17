/**
 * Single error type for every request made through `apiRequest`.
 * Backend errors are `{ error: string }`; we normalize them here so UI code
 * only ever has to deal with `ApiError`.
 */
export class ApiError extends Error {
  readonly status: number
  readonly payload: unknown
  readonly isNetworkError: boolean

  constructor(
    message: string,
    options: { status?: number; payload?: unknown; isNetworkError?: boolean } = {}
  ) {
    super(message)
    this.name = 'ApiError'
    this.status = options.status ?? 0
    this.payload = options.payload ?? null
    this.isNetworkError = options.isNetworkError ?? false
  }
}

export function getErrorMessage(error: unknown, fallback = 'Ocurrió un error inesperado.'): string {
  if (error instanceof ApiError) return error.message
  if (error instanceof Error) return error.message
  if (typeof error === 'string' && error.trim()) return error
  return fallback
}

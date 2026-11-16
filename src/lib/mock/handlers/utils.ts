import { HttpResponse, delay } from 'msw'
import { mockLatencyMs } from '@/lib/api/config'
import { consumeMockFailure } from '../control'

/**
 * Mirrors real network behavior: adds latency and lets tests force a failure
 * via `aguamarinaMock.failNext(status)`.
 */
export async function simulateNetwork(): Promise<Response | null> {
  await delay(mockLatencyMs)

  const status = consumeMockFailure()
  if (!status) return null

  const message =
    status === 401
      ? 'No autorizado (error simulado)'
      : status === 404
        ? 'Recurso no encontrado (error simulado)'
        : `Error interno simulado (HTTP ${status})`

  return HttpResponse.json({ error: message }, { status })
}

export function jsonError(message: string, status: number): Response {
  return HttpResponse.json({ error: message }, { status })
}

export async function readJson<T>(request: Request): Promise<T | null> {
  try {
    return (await request.json()) as T
  } catch {
    return null
  }
}

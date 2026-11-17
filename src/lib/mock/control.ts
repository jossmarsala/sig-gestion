import { clearDataSourceOverride, dataSource, setDataSource } from '@/lib/api/config'
import { resetDb } from './db'

let nextFailureStatus: number | null = null

/** Force the next simulated request to fail with the given HTTP status. */
export function failNextMockRequest(status = 500): void {
  nextFailureStatus = status
}

export function consumeMockFailure(): number | null {
  const status = nextFailureStatus
  nextFailureStatus = null
  return status
}

/**
 * Dev helpers, available from the browser console:
 *
 *   aguamarinaMock.reset()        // restore fixtures
 *   aguamarinaMock.failNext(500)  // next call fails with 500
 *   aguamarinaMock.failNext(401)
 */
export function installMockControls(): void {
  if (typeof window === 'undefined') return

  const target = window as unknown as Record<string, unknown>
  target.aguamarinaDataSource = {
    current: dataSource,
    set: setDataSource,
    clear: clearDataSourceOverride,
  }
  target.aguamarinaMock = {
    reset: resetDb,
    failNext: failNextMockRequest,
  }
}

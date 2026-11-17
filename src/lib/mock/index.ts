import { isMockMode } from '@/lib/api/config'
import { installMockControls } from './control'

let started = false

/**
 * Starts the MSW worker when the effective data source is `mock`.
 * Must be awaited before the first request is rendered (see `main.tsx`).
 */
export async function enableMocking(): Promise<void> {
  installMockControls()

  if (!isMockMode || started) return
  started = true

  const { worker } = await import('./browser')

  await worker.start({
    onUnhandledFrame: 'bypass',
    quiet: true,
    serviceWorker: { url: '/mockServiceWorker.js' },
  })

  console.info('[mock] Datos simulados activos (MSW).')
}

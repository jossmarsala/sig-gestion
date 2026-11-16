import { createSeedDatabase, type MockDatabase } from './fixtures'

const STORAGE_KEY = 'aguamarina:mock-db:v1'

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

function loadPersisted(): MockDatabase | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as MockDatabase
    if (!parsed || !Array.isArray(parsed.producto)) return null
    return parsed
  } catch {
    return null
  }
}

let database: MockDatabase = loadPersisted() ?? createSeedDatabase()

/** Mutable database used by every MSW handler. */
export function getDb(): MockDatabase {
  return database
}

/** Persist after mutations so simulated CRUD survives a page reload. */
export function saveDb(): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(database))
  } catch {
    // Storage may be full/unavailable; the in-memory copy still works.
  }
}

/** Restore the original fixtures (also clears persisted changes). */
export function resetDb(): MockDatabase {
  database = clone(createSeedDatabase())
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
  return database
}

export interface LoggedSet {
  weight: number
  reps: number
  date: string // ISO
}

type LogStore = Record<string, LoggedSet[]>

const LOG_KEY = 'fitbodymap:workout-log'

function readStore(): LogStore {
  try {
    const raw = localStorage.getItem(LOG_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function writeStore(store: LogStore) {
  localStorage.setItem(LOG_KEY, JSON.stringify(store))
}

export function getSets(exerciseId: string): LoggedSet[] {
  const store = readStore()
  return store[exerciseId] ?? []
}

export function addSet(exerciseId: string, set: LoggedSet): LoggedSet[] {
  const store = readStore()
  const list = [...(store[exerciseId] ?? []), set]
  store[exerciseId] = list
  writeStore(store)
  return list
}

export function deleteSet(exerciseId: string, index: number): LoggedSet[] {
  const store = readStore()
  const list = (store[exerciseId] ?? []).filter((_, i) => i !== index)
  store[exerciseId] = list
  writeStore(store)
  return list
}

// Open, public-domain exercise dataset: https://github.com/yuhonas/free-exercise-db
const DATA_URL = 'https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/dist/exercises.json'
const IMAGE_BASE = 'https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/'

export interface Exercise {
  id: string
  name: string
  description: string
  category: string
  level: string
  images: string[]
  primaryMuscles: string[]
  secondaryMuscles: string[]
}

interface RawExercise {
  id: string
  name: string
  instructions?: string[]
  category: string
  level: string
  images?: string[]
  primaryMuscles?: string[]
  secondaryMuscles?: string[]
}

function imageUrl(relativePath: string): string {
  return IMAGE_BASE + relativePath.split('/').map(encodeURIComponent).join('/')
}

function toExercise(raw: RawExercise): Exercise {
  return {
    id: raw.id,
    name: raw.name,
    description: (raw.instructions ?? []).join(' '),
    category: raw.category,
    level: raw.level,
    images: (raw.images ?? []).map(imageUrl),
    primaryMuscles: raw.primaryMuscles ?? [],
    secondaryMuscles: raw.secondaryMuscles ?? [],
  }
}

let cache: Exercise[] | null = null
let inflight: Promise<Exercise[]> | null = null

export function fetchAllExercises(): Promise<Exercise[]> {
  if (cache) return Promise.resolve(cache)
  if (inflight) return inflight
  inflight = fetch(DATA_URL)
    .then((res) => {
      if (!res.ok) throw new Error(`Exercise database error: ${res.status}`)
      return res.json()
    })
    .then((raw: RawExercise[]) => {
      const list = raw.map(toExercise)
      cache = list
      return list
    })
    .finally(() => {
      inflight = null
    })
  return inflight
}

export function exercisesForMuscles(all: Exercise[], muscleNames: string[]): Exercise[] {
  const wanted = new Set(muscleNames)
  return all.filter(
    (e) => e.primaryMuscles.some((m) => wanted.has(m)) || e.secondaryMuscles.some((m) => wanted.has(m)),
  )
}

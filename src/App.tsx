import { useEffect, useMemo, useState } from 'react'
import BodyMap from './components/BodyMap'
import ExerciseList from './components/ExerciseList'
import AnimatedExerciseImage from './components/AnimatedExerciseImage'
import SetLogger from './components/SetLogger'
import { Exercise, exercisesForMuscles, fetchAllExercises } from './data/exerciseDb'
import { BodyView, REGIONS } from './data/muscles'

type Mode = 'browse' | 'search' | 'saved'

const SAVED_KEY = 'fitbodymap:saved-exercises'

function loadSaved(): Exercise[] {
  try {
    const raw = localStorage.getItem(SAVED_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export default function App() {
  const [mode, setMode] = useState<Mode>('browse')
  const [view, setView] = useState<BodyView>('front')

  const [allExercises, setAllExercises] = useState<Exercise[]>([])
  const [dbLoading, setDbLoading] = useState(true)
  const [dbError, setDbError] = useState<string | null>(null)

  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null)
  const [hoveredRegionId, setHoveredRegionId] = useState<string | null>(null)

  const [query, setQuery] = useState('')
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null)

  const [saved, setSaved] = useState<Exercise[]>(() => loadSaved())
  const savedIds = useMemo(() => new Set(saved.map((e) => e.id)), [saved])

  useEffect(() => {
    fetchAllExercises()
      .then(setAllExercises)
      .catch((e) => setDbError(e.message))
      .finally(() => setDbLoading(false))
  }, [])

  const selectedRegion = REGIONS.find((r) => r.id === selectedRegionId) ?? null

  const browseExercises = useMemo(() => {
    if (!selectedRegion) return []
    return exercisesForMuscles(allExercises, selectedRegion.muscles)
  }, [allExercises, selectedRegion])

  const searchResults = useMemo(() => {
    if (query.trim().length < 2) return []
    const q = query.trim().toLowerCase()
    return allExercises.filter((e) => e.name.toLowerCase().includes(q)).slice(0, 40)
  }, [query, allExercises])

  const highlightedMuscles = useMemo(() => {
    if ((mode === 'search' || mode === 'saved') && selectedExercise) {
      return new Set([...selectedExercise.primaryMuscles, ...selectedExercise.secondaryMuscles])
    }
    return new Set<string>()
  }, [mode, selectedExercise])

  function toggleSave(ex: Exercise) {
    setSaved((prev) => {
      const exists = prev.some((s) => s.id === ex.id)
      const next = exists ? prev.filter((s) => s.id !== ex.id) : [...prev, ex]
      localStorage.setItem(SAVED_KEY, JSON.stringify(next))
      return next
    })
  }

  return (
    <div className="app">
      <header>
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="5" r="2.5" />
              <path d="M12 8v7M8 11h8M9 20l3-5 3 5" />
            </svg>
          </span>
          <h1>FitBodyMap</h1>
        </div>
        <p className="tagline">Tap a body part to find exercises. Or search an exercise to see what it works.</p>
        <nav className="tabs">
          <button className={mode === 'browse' ? 'active' : ''} onClick={() => setMode('browse')}>
            Browse by body part
          </button>
          <button className={mode === 'search' ? 'active' : ''} onClick={() => setMode('search')}>
            Search by exercise
          </button>
          <button className={mode === 'saved' ? 'active' : ''} onClick={() => setMode('saved')}>
            My Workout {saved.length > 0 && <span className="count-badge">{saved.length}</span>}
          </button>
        </nav>
      </header>

      {dbError && (
        <p className="error" style={{ marginBottom: 16 }}>
          Couldn't load the exercise database: {dbError}
        </p>
      )}

      <main>
        <div className="map-panel">
          <div className="view-toggle">
            <button className={view === 'front' ? 'active' : ''} onClick={() => setView('front')}>Front</button>
            <button className={view === 'back' ? 'active' : ''} onClick={() => setView('back')}>Back</button>
          </div>
          <BodyMap
            view={view}
            highlightedMuscles={highlightedMuscles}
            selectedRegionId={mode === 'browse' ? selectedRegionId : null}
            hoveredRegionId={mode === 'browse' ? hoveredRegionId : null}
            interactive={mode === 'browse'}
            onSelectRegion={(id) => {
              setSelectedRegionId(id)
              setSelectedExercise(null)
            }}
            onHoverRegion={setHoveredRegionId}
          />
          {mode !== 'browse' && selectedExercise && (
            <p className="map-hint">Highlighting muscles worked by "{selectedExercise.name}"</p>
          )}
        </div>

        <div className="side-panel">
          {mode === 'browse' && (
            <div className="search-panel">
              <ExerciseList
                title={selectedRegion ? selectedRegion.label : 'Select a body part'}
                loading={dbLoading}
                error={null}
                exercises={browseExercises}
                onSelect={setSelectedExercise}
                selectedId={selectedExercise?.id ?? null}
                savedIds={savedIds}
                onToggleSave={toggleSave}
              />
              {selectedExercise && browseExercises.some((e) => e.id === selectedExercise.id) && (
                <ExerciseDetail exercise={selectedExercise} />
              )}
            </div>
          )}

          {mode === 'search' && (
            <div className="search-panel">
              <input
                type="text"
                placeholder="Search an exercise, e.g. Squat"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              {dbLoading && <p className="muted">Loading exercise database…</p>}
              <ExerciseList
                title={query.trim().length < 2 ? 'Type to search' : `Results for "${query}"`}
                loading={false}
                error={null}
                exercises={searchResults}
                onSelect={setSelectedExercise}
                selectedId={selectedExercise?.id ?? null}
                savedIds={savedIds}
                onToggleSave={toggleSave}
              />
              {selectedExercise && <ExerciseDetail exercise={selectedExercise} />}
            </div>
          )}

          {mode === 'saved' && (
            <div className="search-panel">
              <ExerciseList
                title="My Workout"
                loading={false}
                error={null}
                exercises={saved}
                onSelect={setSelectedExercise}
                selectedId={selectedExercise?.id ?? null}
                savedIds={savedIds}
                onToggleSave={toggleSave}
              />
              {saved.length === 0 && (
                <p className="muted">
                  Nothing saved yet. Tap the bookmark icon on any exercise to add it here.
                </p>
              )}
              {selectedExercise && <ExerciseDetail exercise={selectedExercise} />}
            </div>
          )}
        </div>
      </main>

      <footer>
        Exercise data & images from{' '}
        <a href="https://github.com/yuhonas/free-exercise-db" target="_blank" rel="noreferrer">
          free-exercise-db
        </a>{' '}
        (public domain).
      </footer>
    </div>
  )
}

function ExerciseDetail({ exercise }: { exercise: Exercise }) {
  return (
    <div className="exercise-detail">
      <AnimatedExerciseImage images={exercise.images} active className="ex-detail-image" />
      <h4>{exercise.name}</h4>
      <p className="ex-meta">
        {exercise.category} · {exercise.level}
      </p>
      <p>{exercise.description}</p>
      <SetLogger exerciseId={exercise.id} />
    </div>
  )
}

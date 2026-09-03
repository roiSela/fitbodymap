import { useState } from 'react'
import { Exercise } from '../data/exerciseDb'
import AnimatedExerciseImage from './AnimatedExerciseImage'

interface Props {
  title: string
  loading: boolean
  error: string | null
  exercises: Exercise[]
  onSelect?: (ex: Exercise) => void
  selectedId?: string | null
  savedIds?: Set<string>
  onToggleSave?: (ex: Exercise) => void
}

export default function ExerciseList({
  title,
  loading,
  error,
  exercises,
  onSelect,
  selectedId,
  savedIds,
  onToggleSave,
}: Props) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  return (
    <div className="exercise-list">
      <h3>{title}</h3>
      {loading && <p className="muted">Loading exercises…</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && exercises.length === 0 && (
        <p className="muted">Nothing here yet — pick a body part.</p>
      )}
      <ul>
        {exercises.map((ex) => {
          const saved = savedIds?.has(ex.id) ?? false
          return (
            <li
              key={ex.id}
              className={ex.id === selectedId ? 'selected' : ''}
              onClick={() => onSelect?.(ex)}
              onMouseEnter={() => setHoveredId(ex.id)}
              onMouseLeave={() => setHoveredId((h) => (h === ex.id ? null : h))}
            >
              <AnimatedExerciseImage images={ex.images} active={hoveredId === ex.id} className="ex-thumb" />
              <div className="ex-info">
                <div className="ex-name">{ex.name}</div>
                <div className="ex-category">{ex.category}</div>
              </div>
              {onToggleSave && (
                <button
                  className={`save-btn ${saved ? 'saved' : ''}`}
                  aria-label={saved ? 'Remove from my workout' : 'Save to my workout'}
                  onClick={(e) => {
                    e.stopPropagation()
                    onToggleSave(ex)
                  }}
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                    <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1Z" />
                  </svg>
                </button>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

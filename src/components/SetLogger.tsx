import { useState } from 'react'
import { addSet, deleteSet, getSets, LoggedSet } from '../data/workoutLog'

interface Props {
  exerciseId: string
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export default function SetLogger({ exerciseId }: Props) {
  const [sets, setSets] = useState<LoggedSet[]>(() => getSets(exerciseId))
  const [weight, setWeight] = useState('')
  const [reps, setReps] = useState('')

  function handleLog() {
    const w = parseFloat(weight)
    const r = parseInt(reps, 10)
    if (!Number.isFinite(r) || r <= 0) return
    const next = addSet(exerciseId, { weight: Number.isFinite(w) ? w : 0, reps: r, date: new Date().toISOString() })
    setSets(next)
    setReps('')
  }

  function handleDelete(index: number) {
    setSets(deleteSet(exerciseId, index))
  }

  return (
    <div className="set-logger">
      <div className="set-logger-header">Log a set</div>
      <div className="set-logger-form">
        <input
          type="number"
          inputMode="decimal"
          placeholder="Weight"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />
        <input
          type="number"
          inputMode="numeric"
          placeholder="Reps"
          value={reps}
          onChange={(e) => setReps(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleLog()}
        />
        <button onClick={handleLog}>Log</button>
      </div>
      {sets.length > 0 && (
        <ul className="set-history">
          {[...sets].reverse().map((s, i) => {
            const originalIndex = sets.length - 1 - i
            return (
              <li key={originalIndex}>
                <span>{formatDate(s.date)}</span>
                <span>
                  {s.weight > 0 ? `${s.weight} × ` : ''}
                  {s.reps} reps
                </span>
                <button className="set-delete" aria-label="Delete set" onClick={() => handleDelete(originalIndex)}>
                  ×
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

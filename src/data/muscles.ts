// Regions clickable on the body map, mapped to free-exercise-db's muscle name vocabulary.

export type BodyView = 'front' | 'back'

export interface BodyRegion {
  id: string
  label: string
  view: BodyView
  muscles: string[]
  // SVG shape drawn in a 200x420 viewBox
  shape: { kind: 'rect' | 'ellipse'; x: number; y: number; w: number; h: number; rx?: number }
}

export const REGIONS: BodyRegion[] = [
  // ---- front ----
  { id: 'shoulders', label: 'Shoulders', view: 'front', muscles: ['shoulders'],
    shape: { kind: 'ellipse', x: 42, y: 78, w: 20, h: 14 } },
  { id: 'shoulders-r', label: 'Shoulders', view: 'front', muscles: ['shoulders'],
    shape: { kind: 'ellipse', x: 158, y: 78, w: 20, h: 14 } },
  { id: 'chest', label: 'Chest', view: 'front', muscles: ['chest'],
    shape: { kind: 'rect', x: 68, y: 88, w: 64, h: 34, rx: 8 } },
  { id: 'biceps-l', label: 'Biceps', view: 'front', muscles: ['biceps'],
    shape: { kind: 'ellipse', x: 38, y: 118, w: 14, h: 32 } },
  { id: 'biceps-r', label: 'Biceps', view: 'front', muscles: ['biceps'],
    shape: { kind: 'ellipse', x: 162, y: 118, w: 14, h: 32 } },
  { id: 'abs', label: 'Abs', view: 'front', muscles: ['abdominals'],
    shape: { kind: 'rect', x: 68, y: 124, w: 64, h: 48, rx: 8 } },
  { id: 'quads-l', label: 'Quads', view: 'front', muscles: ['quadriceps'],
    shape: { kind: 'ellipse', x: 80, y: 230, w: 18, h: 50 } },
  { id: 'quads-r', label: 'Quads', view: 'front', muscles: ['quadriceps'],
    shape: { kind: 'ellipse', x: 120, y: 230, w: 18, h: 50 } },

  // ---- back ----
  { id: 'traps', label: 'Traps', view: 'back', muscles: ['traps'],
    shape: { kind: 'rect', x: 78, y: 70, w: 44, h: 26, rx: 8 } },
  { id: 'lats-l', label: 'Lats', view: 'back', muscles: ['lats'],
    shape: { kind: 'rect', x: 64, y: 100, w: 20, h: 46, rx: 8 } },
  { id: 'lats-r', label: 'Lats', view: 'back', muscles: ['lats'],
    shape: { kind: 'rect', x: 116, y: 100, w: 20, h: 46, rx: 8 } },
  { id: 'triceps-l', label: 'Triceps', view: 'back', muscles: ['triceps'],
    shape: { kind: 'ellipse', x: 38, y: 118, w: 14, h: 32 } },
  { id: 'triceps-r', label: 'Triceps', view: 'back', muscles: ['triceps'],
    shape: { kind: 'ellipse', x: 162, y: 118, w: 14, h: 32 } },
  { id: 'lower-back', label: 'Lower back', view: 'back', muscles: ['lower back', 'middle back'],
    shape: { kind: 'rect', x: 82, y: 148, w: 36, h: 46, rx: 8 } },
  { id: 'glutes', label: 'Glutes', view: 'back', muscles: ['glutes'],
    shape: { kind: 'rect', x: 76, y: 200, w: 48, h: 30, rx: 12 } },
  { id: 'hamstrings-l', label: 'Hamstrings', view: 'back', muscles: ['hamstrings'],
    shape: { kind: 'ellipse', x: 80, y: 262, w: 18, h: 42 } },
  { id: 'hamstrings-r', label: 'Hamstrings', view: 'back', muscles: ['hamstrings'],
    shape: { kind: 'ellipse', x: 120, y: 262, w: 18, h: 42 } },
  { id: 'calves-l', label: 'Calves', view: 'back', muscles: ['calves'],
    shape: { kind: 'ellipse', x: 80, y: 340, w: 14, h: 34 } },
  { id: 'calves-r', label: 'Calves', view: 'back', muscles: ['calves'],
    shape: { kind: 'ellipse', x: 120, y: 340, w: 14, h: 34 } },
]

# FitBodyMap

Tap a body part to find exercises that work it. Search an exercise to see which muscles it hits. Log your sets to track workouts over time.

**Live demo:** https://roiSela.github.io/fitbodymap/

## Features

- **Browse by body part** — click a region on the front/back body diagram, get a filtered exercise list
- **Search by exercise** — find an exercise by name, see its worked muscles highlighted on the body
- **Real photo demonstrations** — every exercise has two photographed positions that flip on a loop to simulate motion
- **My Workout** — bookmark exercises and log weight × reps per session, with history, all stored locally in your browser
- **Installable PWA** — works offline for anything you've already viewed, installable to your home screen

## Tech stack

- React + TypeScript + Vite
- No backend — exercise data and images come from the open, public-domain [free-exercise-db](https://github.com/yuhonas/free-exercise-db) dataset
- Workout log and saved exercises persist in `localStorage`, nothing leaves your device

## Running locally

```bash
npm install
npm run dev
```

## Deployment

Pushes to `main` auto-deploy to GitHub Pages via `.github/workflows/deploy.yml`.

## License

Exercise data and images: public domain ([Unlicense](https://github.com/yuhonas/free-exercise-db)), courtesy of free-exercise-db.

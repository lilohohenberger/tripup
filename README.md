# TripUp

Interactive prototype for the TripUp group-travel app — the trip dashboard and (soon) the full
last-evening-in-Lisbon journey: group poll → winner lands on the itinerary → expenses → settle up.

Design source of truth: the Figma file (wireflow + hi-fi screens). Token values and the
wireframe→hi-fi rules live in [docs/design-tokens.md](docs/design-tokens.md).

## Stack

- Vite + React + TypeScript
- Tailwind CSS v4 (tokens defined in `src/index.css` via `@theme`)
- SF Pro via the system font stack; SF Symbols rendered as their real glyph code points
  (resolve on Apple devices — the demo target)

## Run

```bash
npm install
npm run dev
```

Open on an iPhone (or a ~393px viewport) for the intended experience. On desktop the app
renders inside a phone-sized stage.

## Notes

- No fake status bar is rendered: on a phone (especially “Add to Home Screen”), the real one
  takes its place.
- Images are committed under `src/assets` (exported from Figma).

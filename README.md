# JS-Flow-Lens
Browser-based static analysis that ingests bundled JavaScript (without source maps) to reconstruct a function-level call graph for interactive exploration.

## Purpose
- Audit production bundles when repository access or source maps are unavailable.
- Keep the UI responsive by offloading parsing and graph construction to a Web Worker.
- Provide quick insight into module/group boundaries, call relationships, and confidence levels for inferred names.

## Architecture (big picture)
- **Main thread (React + Sigma.js):** Renders the graph, handles user interactions, status/warnings, and triggers lazy detail fetches.
- **Worker (AnalysisWorker via Comlink):** Reads bundle files, parses with Acorn, detects bundler patterns (webpack/define) for module IDs, extracts functions/calls, scores confidence, and builds graph payloads. Caches payload for `resolveNodeDetail`.
- **Graph data:** Graphology graph rendered with Sigma.js; ForceAtlas2 layout applied before render for spatial distribution.
- **State:** Zustand store holds payload, Graphology instance, status/warnings/errors, hover/selection, and inspector data.
- **Heuristics:** Module ID inference from runtime wrappers, inferred callee names, confidence scoring, weak edges for unknown calls, lazy node detail lookup.

## Usage
### Prereqs
- Node 18+ recommended.
- Modern Chromium-based browser (File System Access API).

### Install
```bash
npm install
```

### Run dev server
```bash
npm run dev
# open http://localhost:5173
```

### Build
```bash
npm run build
```

### Preview production build
```bash
npm run preview
```

### Lint
```bash
npm run lint
```

### Tests
```bash
npm test              # full suite
npm run test:coverage # coverage
```

## Docker / Compose
### Build and run with Docker
```bash
docker build -t js-flow-lens .
docker run -p 4173:4173 js-flow-lens
# open http://localhost:4173
```

### Run with docker compose
```bash
docker compose up --build
# open http://localhost:4173
```

## How it works (flow)
1. User selects a bundle directory (File System Access API).
2. Main thread hands the directory handle to `AnalysisWorker` via Comlink.
3. Worker enumerates `.js` files, parses with Acorn, detects module IDs, extracts functions/calls, scores confidence, and builds nodes/edges.
4. Payload returns to the main thread, normalized into Graphology; ForceAtlas2 layout runs, Sigma renders.
5. On node selection, UI calls `resolveNodeDetail` for cached neighborhood data and shows module/confidence plus any warnings.

## Development guide
### Extending parsing/heuristics
- Entry: `src/workers/analysis.worker.ts`
- Helpers: `stringifyCallee`, `detectModuleIdFromSnippet`, `scoreConfidence`
- Add bundler pattern detectors (Rollup chunk maps, SystemJS, etc.) and improve `moduleId`.
- Enhance name inference via property keys, export objects, or nearby string literals.
- For large bundles, keep parsing in the worker; consider streamed reads or throttled traversal.

### Graph/layout improvements
- Layout helper: `src/layout/runLayout.ts` (ForceAtlas2). Tune `slowDown`, `gravity`, `iterations` for larger graphs.
- For very large graphs, consider running layout in a dedicated worker (Graphology FA2 worker) and updating node positions via payload.
- Confidence-driven styling lives in `src/components/GraphCanvas.tsx`; adjust color/size mapping there.

### UI/inspector enhancements
- UI root: `src/App.tsx`
- Inspector shows label, module, file, confidence, and lazy detail warnings. Extend to show incident edges, source offsets, or snippets from `resolveNodeDetail`.
- Add search/filter or neighborhood highlighting in `GraphCanvas.tsx` via Sigma events (`useRegisterEvents`).

### State management
- Store: `src/store/useGraphStore.ts`
- Holds payload, Graphology instance, status, warnings, error, hover/selection. Add slices for filters or pinned nodes here.

### Testing
- Vitest + React Testing Library + jsdom.
- Key suites:
  - `src/test/heuristics.test.ts` (module ID, confidence, lazy detail)
  - `src/test/layout.test.ts` (ForceAtlas2 invocation)
  - `src/test/app.test.tsx` (UI status/warning flows)
  - `src/test/store.test.ts`, `src/test/worker-helpers.test.ts`
- Mock heavy deps (Sigma/WebGL/FA2) to keep tests fast; add focused unit tests for new heuristics or layout logic.

## Roadmap notes
- Zip upload fallback (not yet implemented).
- Richer lazy resolution (source snippets, lexical breadcrumbs).
- Performance benchmarking on large bundles; consider layout offload to worker if UI stutters.

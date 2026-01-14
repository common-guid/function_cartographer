# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.
See the AGENTS.md file for operating instructions from the lead engineer.

## Project Overview

JS-Flow-Lens is a browser-based static analysis platform that ingests production artifacts (bundled JS and Source Maps) to reconstruct and visualize function-to-function call graphs. It bridges the gap between obfuscated execution code and developer-intent source code, enabling senior engineers to audit architectural integrity without access to the original Git repository.

## Common Development Commands

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```
Starts the Vite dev server with HMR at `http://localhost:5173`.

### Build
```bash
npm run build
```
Runs TypeScript type checking (`tsc -b`) followed by Vite production build. Output is in `dist/`.

### Linting
```bash
npm lint
```
Runs ESLint across all TypeScript and TypeScript React files using the flat config in `eslint.config.js`.

### Preview
```bash
npm run preview
```
Preview the production build locally.

## Architecture Overview

### High-Level Design
The application follows a **worker-based architecture** to keep the UI responsive during heavy computation:
- **Main Thread (React):** Handles user interactions, UI rendering, and graph visualization via Sigma.js
- **Web Worker (AnalysisWorker):** Performs all CPU-intensive operations (AST parsing, source map resolution, graph construction)
- **Communication Layer (Comlink):** Abstracts `postMessage` complexity into RPC-style async function calls between main thread and worker

### Directory Structure
```
src/
├── components/      # React UI components
│   └── GraphCanvas.tsx     # Sigma.js graph visualization wrapper
├── services/        # Utilities for external APIs
│   └── fileSystem.ts       # File System Access API wrapper
├── store/           # State management (Zustand)
│   └── useGraphStore.ts    # Graph state (nodes, edges, hover state)
├── workers/         # Web Worker code
│   └── analysis.worker.ts  # Core AST parsing and graph construction (off-main-thread)
├── App.tsx          # Main application component
└── main.tsx         # Entry point
```

### Key Technology Choices

**State Management (Zustand):** Used for graph state because it supports transient updates without triggering full React re-renders, which is critical for high-frequency hover state changes during interaction.

**Visualization (Sigma.js + Graphology):** 
- Sigma.js: WebGL-accelerated rendering engine optimized for 10k-100k node graphs. Maintains 60 FPS by separating the rendering loop from data layer.
- Graphology: Graph data structure library that pairs with Sigma.js. Handles node/edge management and layout algorithms like ForceAtlas2.

**Parsing (Acorn):** Lightweight ES6+ parser configured in the worker for AST extraction of function declarations and call expressions.

**Source Maps (mozilla/source-map):** Maps minified bundle locations back to original source code. The WASM version is mandatory for performance on large bundles (>50MB).

**File System Access API:** Provides read-only directory access (via `window.showDirectoryPicker()`) to process multi-part bundles as relative files.

### Data Flow
1. User selects a directory via File System Access API
2. Main thread passes directory handle to AnalysisWorker via Comlink
3. Worker reads `.js` and `.map` files, parses AST with Acorn, extracts function calls
4. Worker resolves minified names to original code via source maps
5. Worker builds adjacency list (nodes and edges) and returns serialized graph
6. Main thread loads graph into Graphology and renders via Sigma.js

## TypeScript Configuration

**Two separate configurations:**
- `tsconfig.app.json`: Targets ES2022, includes DOM/DOM.Iterable libs. Strict mode enabled with `noUnusedLocals`, `noUnusedParameters`, and `noUncheckedSideEffectImports`.
- `tsconfig.node.json`: Targets ES2023, includes only Node types. Used for build tools (Vite).

Both reference the parent `tsconfig.json` which chains them.

## ESLint Setup

Uses flat config format (`eslint.config.js`). Includes:
- `@eslint/js` recommended rules
- `typescript-eslint` recommended rules
- `eslint-plugin-react-hooks` recommended rules
- `eslint-plugin-react-refresh` Vite plugin rules

The config ignores `dist/` directory.

## Important Notes

- All parsing and graph construction must occur in the **Web Worker** to prevent UI blocking
- The **File System Access API** is experimental; fallback to `.zip` upload for older browsers (not yet implemented)
- **Memory management:** For bundles >50MB, implement lazy resolution strategy (resolve node names on-demand instead of during load)
- **Circular dependencies** are handled natively by Sigma.js rendering, but lexical hierarchy calculation must detect recursion
- Code is strictly typed with strict mode enabled; unused variables and parameters are flagged as errors

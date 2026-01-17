# JS-Flow-Lens
A static analysis visualization tool that ingests bundled JavaScript (without source maps) to reconstruct a function-level call graph for interactive exploration.

## Purpose
- Audit production bundles when repository access or source maps are unavailable.
- Visualize module boundaries and call relationships using heuristic reconstruction and de-bundling.
- Provide quick insight into architectural integrity and potential "dead code" or "vendor bloat".

## Architecture (big picture)
- **CLI (Node.js):** The `js-lens serve <dir>` command runs a local Express server. It analyzes the target directory using `@wakaru/unpacker` (to de-bundle Webpack/Rollup chunks) and Acorn (to parse AST and extract call graphs).
- **Frontend (React + Sigma.js):** Connects to the local CLI server to fetch the analysis payload. Renders the graph using WebGL for high performance.
- **Analysis Logic:**
    - **De-bundling:** Uses `@wakaru/unpacker` to break bundles back into virtual modules.
    - **Tagging:** Heuristically tags nodes as `source`, `vendor`, `boilerplate`, or `framework` based on path and content.
    - **Graph Building:** Constructs a directed graph of function declarations and calls.
- **State:** Zustand store holds payload, Graphology instance, status/warnings/errors, and filter state.

## Usage

### Prereqs
- Node 18+ recommended.

### Install
```bash
npm install
npm run build      # Builds the frontend
npm run build:cli  # Builds the CLI
```

### Analyze a directory
Run the CLI to analyze a directory containing JavaScript bundles and serve the visualization:

```bash
# Run from the project root
./dist-cli/index.js serve /path/to/your/bundles

# Or using the npm script shorthand (dev mode)
npm run dev:cli -- serve /path/to/your/bundles
```

Options:
- `-p, --port <number>`: Port to run the server on (default: 3000).

Open your browser to `http://localhost:3000` (or the specified port).

### Development Mode

1. **Start the Frontend Dev Server:**
   ```bash
   npm run dev
   ```
   This starts Vite at `http://localhost:5173`. It is configured to proxy API requests to `http://localhost:3000`.

2. **Start the CLI Server (in a separate terminal):**
   ```bash
   npm run dev:cli -- serve ./sample_js-files/simple -p 3000
   ```
   This runs the analysis server on port 3000 using `tsx` for hot-reloading backend logic.

### Tests
```bash
npm test              # full suite (CLI logic + frontend components)
npm run test:coverage # coverage report
```

## Docker / Compose
*(Note: Docker instructions need update for CLI architecture - coming soon)*

## How it works (flow)
1. **CLI Analysis:** The user runs `js-lens serve <dir>`. The CLI scans the directory, de-bundles files, parses ASTs, and builds a graph payload in memory.
2. **Server:** An Express server starts, exposing the payload at `GET /api/graph` and serving the static frontend assets from `dist/`.
3. **Frontend Load:** The browser loads the app, which immediately fetches the graph data from the API.
4. **Visualization:** Sigma.js renders the graph. ForceAtlas2 layout is applied to cluster related modules.
5. **Interaction:** Users can click nodes to inspect details, filter by tags (Vendor, Framework, etc.), and search for specific functions.

## Development guide
### Extending parsing/heuristics
- **Location:** `src/cli/analysis.ts`
- **Logic:** This file contains the `Analyzer` class, which handles file traversal, unpacking, and AST traversal.
- **Helpers:** `detectTags`, `scoreConfidence`, `moduleIdFromPath`.

### Graph/layout improvements
- **Layout:** `src/layout/runLayout.ts` (ForceAtlas2). Tune parameters here.
- **Styling:** `src/components/GraphCanvas.tsx` handles node/edge visual attributes based on the store state.

### UI/inspector enhancements
- **Root:** `src/App.tsx`
- **State:** `src/store/useGraphStore.ts` holds the application state (filters, selection, payload).

### Testing
- **CLI Logic:** `src/cli/test/analysis.test.ts` covers the Node.js analysis pipeline.
- **Frontend Logic:** `src/test/` contains tests for filters, heuristics (legacy), and components.

## Roadmap notes
- Add ability to export/import graph payloads (JSON).
- Improve "virtual filesystem" visualization for unpacked modules.
- Support for more bundlers beyond Webpack.

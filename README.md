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
npm run build      # Builds both the CLI and the Frontend
```

### Analyze a directory
Run the CLI to analyze a directory containing JavaScript bundles and serve the visualization:

```bash
# Run using node from the project root
node ./dist-cli/cli/index.js serve /path/to/your/bundles

# Or using the npm script shorthand (runs built CLI)
npm run preview -- serve /path/to/your/bundles
```

Options:
- `-p, --port <number>`: Port to run the server on (default: 3000).
- `--no-build-ui`: Skip rebuilding the UI when `dist/` is missing or stale.
- `--humanify`: Enable LLM-based humanification via humanify-plus (requires API key).
- `--humanify-scope <scope>`: Humanify scope: `source` (default) or `all` (includes vendor).

Open your browser to `http://localhost:3000` (or the specified port).

#### Humanify (LLM-assisted renaming)
To enable humanification, set the OpenRouter API key and pass `--humanify`:

```bash
export HUMANIFY_OPENROUTER_API_KEY=your_key
node ./dist-cli/cli/index.js serve /path/to/your/bundles --humanify --humanify-scope source
```

**Configuration Environment Variables:**
- `HUMANIFY_OPENROUTER_API_KEY`: Your OpenRouter API key.
- `HUMANIFY_PLUS_MODEL`: (Optional) Override default model (default: `x-ai/grok-4.1-fast`).
- `HUMANIFY_CONCURRENCY`: (Optional) Control the number of files processed in parallel (default: `5`).

Example using concurrency control:

```bash
export HUMANIFY_CONCURRENCY=10
export HUMANIFY_OPENROUTER_API_KEY=your_key
export HUMANIFY_PLUS_MODEL=anthropic/claude-3.5-sonnet
node ./dist-cli/cli/index.js serve /path/to/your/bundles --humanify --humanify-scope all
```

#### Archiving Processed Files
When running the CLI against the project's `sample_js-files` directory (e.g. `node ./dist-cli/cli/index.js serve sample_js-files`), the tool enables an **archiving mode**:
- **Output:** Processed (humanified or beautified) files are written to `processed/output/`.
- **Archive:** Original input files are moved to `processed/sample_js-files/`.
- **Duplicates:** If a file has already been processed (exists in output), the input file is moved to `processed/dupes/` to avoid reprocessing.
- **Relative Paths:** The directory structure is preserved in all target directories.
- **Consistency:** Unpacking is disabled in this mode to ensure the archived file maps 1-to-1 with the input file, allowing consistent re-analysis of the archived output.

### Development Mode

To work on both the frontend and the backend simultaneously:

1. **Start the CLI Server (Backend):**
   ```bash
   # Starts the analysis server on port 3000 using tsx for hot-reloading
   npm run dev:cli -- serve ./sample_js-files/simple -p 3000
   ```

2. **Start the Frontend Dev Server:**
   ```bash
   # Starts Vite at http://localhost:5173 (proxies API requests to port 3000)
   npm run dev
   ```

### Previewing the Production Build
To test the built application with sample files:
```bash
npm run preview
```
This runs the built CLI on the `./sample_js-files` directory.

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

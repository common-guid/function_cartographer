## Test suite stabilization | 2026-01-14
Implemented Vitest + RTL + jsdom suite, mocked WebGL graph canvas, fixed store selector instability in App, and verified all tests pass (3 files, 10 tests).
## Heuristic tests | 2026-01-14
Added unit tests for module-id detection, confidence scoring, and resolveNodeDetail; expanded suite to 4 files/15 tests and confirmed all passing.
## Dockerization | 2026-01-14
Added Dockerfile and docker-compose.yml to build and serve the Vite preview at port 4173; updated README with Docker/Compose usage.
## Sample bundle evaluation | 2026-01-14
Tested JS-Flow-Lens on 10 production Webpack bundles (sample_js-files, 396 KB total). Built comprehensive evaluation report confirming MVP-ready functionality: 3000+ nodes, stable visualization, robust UI. Identified high-priority improvements (search/filter, edge toggle, layout offload). All tests passing.
## UI initialization fix | 2026-01-14
Investigated blank white page issue on preview server. Created ErrorBoundary component to surface initialization errors and added File System Access API guard with clear error messaging. Rebuilt application and confirmed UI loads successfully with control panel, status indicator, and Sigma canvas. Screenshot captured showing functional idle state ready for user interaction.
## Graph edge attribute error fix | 2026-01-15
Fixed Graphology edge insertion to use the keyed edge API so attributes are passed correctly, preventing the InvalidArgumentsGraphError when loading a project directory.
## Noise reduction filters | 2026-01-16
Added node tagging in the analysis worker and UI-driven filters (search, confidence, vendor/framework/boilerplate toggles) with optional neighbor expansion to reduce graph noise.
## Filter test suite | 2026-01-16
Created comprehensive test coverage for filter feature: detectTags heuristics (23 tests), filter store state management (22 tests), and filter rendering logic including tag/confidence/search filtering and edge visibility (31 tests). All 93 tests passing.
## Integration of Wakaru Unpacker | 2026-01-16
Integrated `@wakaru/unpacker` for structural de-bundling in the analysis worker, allowing precise tagging of vendor modules and falling back to raw analysis.
## Migration to Node.js CLI Pipeline | 2026-01-16
Moved analysis from browser worker to a Node.js CLI (`js-lens serve`) to solve `@wakaru/unpacker` dynamic require issues. Created a server-side analysis pipeline using Express, handled the dependency constraints with a custom require shim, and refactored the frontend to consume the API.

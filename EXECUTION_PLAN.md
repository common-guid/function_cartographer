## 1. Introduction
Auditing modern, webpacked JavaScript applications in production environments is an opaque process. Source code is bundled, minified, and tree-shaken, effectively destroying the readability of logic flows. While source maps exist for debugging steps, there is no tool that aggregates this data to visualize high-level architectural dependencies or lineage.

**JS-Flow-Lens** is a browser-based static analysis platform. It ingests production artifacts (bundled JS and Source Maps) to reconstruct and visualize the function-to-function call graph. It bridges the gap between obfuscated execution code and developer-intent source code, allowing senior engineers to audit architectural integrity and trace logic flows without access to the original Git repository.

## 2. Goals & Objectives

### 2.1 Primary Goal
Deliver a high-performance, client-side visualization engine capable of rendering 10,000+ nodes. The tool must allow engineers to identify dependencies and call chains with zero UI latency (maintain >30 FPS during interaction).

### 2.2 Secondary Goal
Provide "Deep-Dive Inspection" capabilities. Users must be able to click any node to resolve its obfuscated identity back to the original file path, function name, and lexical scope hierarchy using Source Map reconstruction.

## 3. Functional Requirements

### 3.1 Data Ingestion Module
*   **File System Access API:** Implement `window.showDirectoryPicker()` to allow read-only access to a local build directory. This enables the processing of multi-part bundles (chunks) relative to one another.
*   **Legacy Fallback:** Support `.zip` archive upload containing `.js` and `.map` files.
*   **Validation:** System must verify pairs of JS bundles and their corresponding `.map` files before initiating the parsing pipeline.

### 3.2 AST Analysis Engine (Headless)
*   **Parsing:** The engine must parse standard ECMAScript (ES6+) syntax.
*   **Symbol Extraction:**
    *   Identify all **Function Declarations** (including Arrow Functions, Class Methods, and IIFEs).
    *   Identify all **Call Expressions**.
*   **Scope Resolution:** Construct a symbol table to track variable shadowing. The engine must determine if a function call refers to a local declaration, an imported module, or a global.
*   **Source Map Consumer:** Map the location (line/column) of the parsed bundle AST nodes back to the `originalPosition` (source file, source line, original name).

### 3.3 Interactive Graph UI
*   **Visualization Methodology:** Directed Graph.
    *   **Nodes:** Functions.
    *   **Edges:** Call invocations.
*   **Interactivity:**
    *   **Pan/Zoom:** WebGL-accelerated canvas navigation.
    *   **Node Highlighting:** Hovering a node highlights incoming (callers) and outgoing (callees) edges; dims unrelated nodes.
    *   **Search:** Regex-based filtering against resolved function names and file paths.
*   **Focus Mode:** Ability to double-click a node and re-render the graph showing *only* the connected component (up to N degrees of separation) for that specific function.

### 3.4 Node Inspector & Context
Upon node selection, a side panel must render:
*   **Identity:** Resolved Function Name (e.g., `handleSubmit`) vs. Minified Name (e.g., `n`).
*   **Location:** Original File Path (e.g., `src/components/Form.tsx`).
*   **Lexical Hierarchy (Breadcrumbs):** A computed tree reflecting the nesting definition.
    *   *Example:* `main.ts` > `App Class` > `render()` > `submitButton.onClick`.

## 4. Technical Architecture

### 4.1 Frontend Stack & State
*   **Framework:** **React** (v18+) with **TypeScript**.
*   **State Management:** **Zustand**. Chosen for its transient update capabilities, allowing high-frequency changes (like graph hover states) without causing React re-renders for the entire tree.
*   **Styling:** Tailwind CSS for layout; non-blocking UI components (Shadcn/UI).

### 4.2 Visualization Engine
*   **Library:** **Sigma.js v2** (rendering) + **Graphology** (graph data structure).
*   **Rationale:** Sigma.js utilizes a custom WebGL renderer optimized specifically for graph networks. It separates the rendering loop from the data layer, allowing it to handle 10k-100k nodes significantly better than D3.js or SVG-based libraries.
*   **Layout Algorithm:** ForceAtlas2 (via Graphology worker) to naturally cluster highly coupled modules.

### 4.3 Processing Strategy (The "Heavy Lifting")
All file parsing and AST traversal must occur off the main thread to prevent UI freezing.
*   **Web Workers:** Implement a dedicated `AnalysisWorker`.
*   **Communication:** Use **Comlink** (Google) to abstract `postMessage` complexity into RPC-style async function calls.
*   **Parsing Library:** **Acorn** or **Babel Parser** (configured for speed/loose mode).
*   **Source Map Handling:** **mozilla/source-map** (WASM version). The JavaScript implementation is too slow for large bundles; the WASM binding is mandatory for performance metrics.

### 4.4 Data Flow
1.  **Main Thread:** User selects directory -> handles are passed to Worker.
2.  **Worker:** Reads file streams -> Parses AST -> Extracts Calls -> Queries Source Map -> Builds Adjacency List.
3.  **Worker:** Returns a serialized Graphology object (nodes/edges) to Main Thread.
4.  **Main Thread:** Sigma.js loads graph data -> Starts WebGL loop.

## 5. Error Handling & Edge Cases

### 5.1 Memory Management (The 50MB+ Bundle Problem)
*   **Constraint:** Browser tabs have heap limits (approx 2GB - 4GB).
*   **Mitigation:**
    *   Implement **Streaming Parsing** where possible via standard `ReadableStream`.
    *   If the source map exceeds 100MB, the worker should implement a "Lazy Resolution" strategy: Resolve node names *on-demand* (when clicked) rather than resolving all 10,000 nodes during initial load.

### 5.2 Mismatched or Missing Source Maps
*   If a `.map` file is missing or the `sourcesContent` does not match the generated code:
    *   **Fallback:** The system must visualize the graph using the minified names (e.g., `_a calls _b`).
    *   **Notification:** A non-blocking toast warning indicating "Source Context Unavailable for [File Name]."

### 5.3 Circular Dependencies
*   Recursive functions or circular module imports (A imports B imports A) can crash layout algorithms.
*   **Solution:** The adjacency list construction must track visited nodes during traversal to detect cycles. The graph visualization handles cycles natively, but the *Lexical Hierarchy* calculation must detect recursion to prevent infinite breadcrumb generation.

## 6. Success Metrics

### 6.1 Performance Criteria
*   **Time-to-Interactive (TTI):** < 5 seconds for a 5MB bundle.
*   **Rendering Capacity:** Stable 60 FPS while panning/zooming a graph of 10,000 nodes on a standard M1/M2 equivalent machine.
*   **Layout Time:** ForceAtlas2 convergence within 10 seconds for 10,000 nodes.

### 6.2 Accuracy Criteria
*   **Resolution Parity:** 100% match between the tool's reported "Original File Path" and the path defined in the uploaded `.map` file.
*   **Orphan Detection:** The tool effectively groups "Orphaned Nodes" (dead code not reachable from entry points) visually apart from the main cluster.

## 7. Implementation Roadmap (Phase 1)
1.  **Scaffold:** React + Vite + Comlink setup.
2.  **Core:** Implement File System Access API + Basic AST Parser in Worker.
3.  **Vis:** Hook up Sigma.js with dummy data.
4.  **Integration:** Connect Parser output to Sigma.js input.
5.  **Refinement:** Implement Source Map WASM resolution and Breadcrumb logic.
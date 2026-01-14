## 1. Introduction

Auditing modern, webpacked JavaScript applications in production environments is an opaque process. Source code is bundled, minified, and tree-shaken, effectively destroying the readability of logic flows.  **JS-Flow-Lens** is a browser-based static analysis platform designed explicitly for **black-box auditing**. It ingests raw production artifacts (bundled JS files only) to heuristically reconstruct and visualize the function-to-function call graph. It bridges the gap between obfuscated execution code and developer-intent source code, allowing senior engineers to audit architectural integrity and trace logic flows without access to the original Git repository or Source Maps. 

---

## 2. Goals & Objectives

### 2.1 Primary Goal

Deliver a high-performance, client-side visualization engine capable of rendering 10,000+ nodes. The tool must allow web application audit engineers to identify dependencies, call chains, and the flow of data with zero UI latency (maintain >30 FPS during interaction). 

### 2.2 Secondary Goal (The "Reverse Engineering" Engine)

Provide "Deep-Dive Inspection" capabilities through reconstruction. Users must be able to click any node to resolve its obfuscated identity back to a predicted scope hierarchy. 

* **Constraint:** The system operates **without** `.map` files.
* 
**Objective:** Use heuristic analysis to achieve results *similar* to Source Map reconstruction by analyzing AST patterns and Webpack runtime boilerplate. 



---

## 3. Functional Requirements

### 3.1 Data Ingestion Module

* 
**File System Access API:** Implement `window.showDirectoryPicker()` to allow read-only access to a local build directory. 


* 
**Bundle Processing:** The system must process multi-part bundles (chunks) relative to one another to identify split points. 


* 
**Validation:** System must verify the integrity of JS bundles (validating headers/magic bytes) before initiating the parsing. 



### 3.2 AST Analysis & Reconstruction Engine (Headless)

* 
**Parsing:** The engine must parse standard ECMAScript (ES6+) syntax. 


* 
**Symbol Extraction:** Identify all **Function Declarations** (including Arrow Functions, Class Methods, and IIFEs). 


* **Heuristic De-obfuscation:**
* **Module Boundary Detection:** Identify Webpack/Rollup module wrappers (e.g., `__webpack_require__` patterns) to group minified functions into logical "Virtual Modules."
* **Inferred Naming:** Attempt to infer function names based on string literals, object property assignments, or export keys found within the scope.


* 
**Scope Resolution:** Construct a symbol table to track variable shadowing. The engine must determine if a function call refers to a local declaration, an imported module, or a global variable. 



### 3.3 Interactive Graph UI

* **Visualization Methodology:** Directed Graph.
* **Nodes:** Functions (grouped by inferred module).
* 
**Edges:** Call invocations. 




* **Interactivity:**
* 
**Pan/Zoom:** WebGL-accelerated canvas navigation. 


* 
**Node Highlighting:** Hovering a node highlights incoming (callers) and outgoing (callees) edges; dims unrelated nodes. 


* 
**Search:** Regex-based filtering against inferred names and raw code content. 


* 
**Focus Mode:** Ability to double-click a node and re-render the graph showing *only* the connected component (up to N degrees of separation). 





### 3.4 Node Inspector & Context

Upon node selection, a side panel must render:

* 
**Identity:** The Minified Name (e.g., `n`) alongside any **Inferred Name** (e.g., `Predicted: handleSubmit`). 


* **Location:** The specific chunk file and byte offset.
* 
**Reconstructed Hierarchy:** A computed tree reflecting the nesting definition derived from AST traversal. 


* 
*Example:* `main.923a.js` > `Webpack Module 492` > `Export "default"` > `submitButton.onClick`. 





---

## 4. Technical Architecture

### 4.1 Frontend Stack & State

* 
**Framework:** **React** (v18+) with **TypeScript**. 


* **State Management:** **Zustand**. Chosen for its transient update capabilities (high-frequency graph hover states) without causing React re-renders. 


* 
**Styling:** Tailwind CSS for layout; non-blocking UI components (Shadcn/UI). 



### 4.2 Visualization Engine

* 
**Library:** **Sigma.js v2** (rendering) + **Graphology** (graph data structure). 


* 
**Rationale:** Sigma.js utilizes a custom WebGL renderer optimized specifically for graph networks. It separates the rendering loop from the data layer, allowing it to handle 10k-100k nodes significantly better than D3.js. 


* 
**Layout Algorithm:** ForceAtlas2 to naturally cluster highly coupled modules (recreating the "file" structure visually). 



### 4.3 Processing Strategy (The "Heavy Lifting")

All file parsing and AST traversal must occur off the main thread. 

* 
**Web Workers:** Implement a dedicated `AnalysisWorker`. 


* 
**Communication:** Use **Comlink** to abstract `postMessage` complexity into RPC-style async function calls. 


* 
**Parsing Library:** **Acorn** or **Babel Parser** (configured for speed/loose mode) to handle minified/obfuscated quirks. 



### 4.4 Data Flow

1. 
**Main Thread:** User selects directory -> handles are passed to Worker. 


2. 
**Worker:** Reads file streams -> Parses AST -> Extracts Calls. 


3. **Worker (Reconstruction Step):** Analyzes AST for module patterns (e.g., `(window.webpackJsonp = ...)`), assigns virtual module IDs, and builds the Adjacency List based on these inferred boundaries.
4. 
**Worker:** Returns a serialized Graphology object to Main Thread. 


5. 
**Main Thread:** Sigma.js loads graph data -> Starts WebGL loop. 



---

## 5. Error Handling & Edge Cases

### 5.1 Memory Management (The 50MB+ Bundle Problem)

* 
**Constraint:** Browser tabs have heap limits (approx 2GB - 4GB). 


* **Mitigation:**
* Implement **Streaming Parsing** where possible via standard `ReadableStream`. 


* 
**Lazy De-obfuscation:** If the AST is massive, perform deep heuristic name analysis *on-demand* (when clicked) rather than resolving all 10,000 nodes during initial load. 





### 5.2 Ambiguous Call Sites (Dynamic Dispatch)

* Since source maps are unavailable, dynamic calls (e.g., `module[funcName]()`) cannot be easily resolved.
* **Fallback:** The system must visualize these as "Weak Edges" or "Unresolved Calls" connected to a generic "Unknown" node.
* 
**Notification:** UI must indicate "Inferred Flow - Low Confidence" for these specific edges. 



### 5.3 Circular Dependencies

* Recursive functions or circular module imports can crash layout algorithms. 


* 
**Solution:** The adjacency list construction must track visited nodes during traversal to detect cycles. The *Lexical Hierarchy* calculation must detect recursion to prevent infinite breadcrumb generation. 



---

## 6. Success Metrics

### 6.1 Performance Criteria

* 
**Time-to-Interactive (TTI):** < 5 seconds for a 5MB bundle. 


* 
**Rendering Capacity:** Stable 60 FPS while panning/zooming a graph of 10,000 nodes on a standard M1/M2 equivalent machine. 


* 
**Layout Time:** ForceAtlas2 convergence within 10 seconds for 10,000 nodes. 



### 6.2 Reconstruction Accuracy Criteria

* **Module Clustering:** The tool must successfully identify and visually cluster at least 90% of the Webpack modules defined in the bundle runtime.
* 
**Orphan Detection:** The tool effectively groups "Orphaned Nodes" (dead code/unused exports) visually apart from the main cluster. 



---

## 7. Implementation Roadmap (Phase 1)

1. 
**Scaffold:** React + Vite + Comlink setup. 


2. 
**Core:** Implement File System Access API + AST Parser in Worker. 


3. 
**Vis:** Hook up Sigma.js with dummy data. 


4. 
**Integration:** Connect Parser output to Sigma.js input. 


5. 
**Refinement:** Implement **Heuristic Analysis Module** to detect Webpack patterns and generate inferred names (replacing Source Map logic). 


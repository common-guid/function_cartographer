# **Phase 2: Noise Reduction & Filtering Implementation Plan**

**Objective:** Transform the application from a raw visualizer into an auditing tool by enabling the user to filter out generic vendor/framework code and focus on business logic. This involves classifying nodes during ingestion and providing real-time filtering controls in the UI.

---

### **Task 1: Data Structure Enhancements**
**Goal:** Define the schema for node categorization and filter state.

1.  **Update `src/types/graph.ts`**:
    *   Define `NodeType` union type: `'source' | 'vendor' | 'boilerplate' | 'framework'`.
    *   Define `FilterState` interface containing:
        *   `searchQuery` (string)
        *   `showVendor` (boolean)
        *   `showBoilerplate` (boolean)
        *   `showFramework` (boolean)
        *   `minConfidence` ('low' | 'medium' | 'high')
    *   Update `NodePayload` interface to include `tags: NodeType[]`.

---

### **Task 2: Intelligent Tagging (Analysis Worker)**
**Goal:** Classify nodes during the parsing phase based on file paths and code patterns.

1.  **Modify `src/workers/analysis.worker.ts`**:
    *   **Implement `detectTags(path: string, codeSnippet: string): NodeType[]`**:
        *   **Vendor Heuristics:** If path includes `node_modules`, `vendor`, `chunk-vendors`, or `polyfill` -> tag as `'vendor'`. Else tag as `'source'`.
        *   **Boilerplate Heuristics:** If snippet includes `__webpack_require__`, `self.webpackChunk`, or `(function(modules)`, tag as `'boilerplate'`.
        *   **Framework Heuristics:** If snippet includes `React.createElement`, `.jsx`, or `$$typeof`, tag as `'framework'`.
    *   **Update `processDirectory`**:
        *   Call `detectTags` immediately after reading the file text (use the first ~1000 characters for snippet analysis).
        *   Assign these tags to the file-level node in `nodeMap`.
        *   When creating AST nodes (Functions/Calls), propagate the parent file's tags to the new nodes via the `meta` argument in `addNode`.

---

### **Task 3: State Management Updates**
**Goal:** Create a centralized store for filter preferences that drives the visualization.

1.  **Modify `src/store/useGraphStore.ts`**:
    *   **Update State Interface:** Add `filters: FilterState` to `GraphState`.
    *   **Set Defaults:** Define `DEFAULT_FILTERS`:
        *   `showVendor`: `false` (Hide noise by default)
        *   `showBoilerplate`: `false`
        *   `showFramework`: `false`
        *   `minConfidence`: `'low'`
        *   `searchQuery`: `''`
    *   **Add Action:** Implement `setFilter(key: keyof FilterState, value: any)` to update specific filter properties.
    *   **Update Reset:** Ensure `reset()` restores `filters` to `DEFAULT_FILTERS`.

---

### **Task 4: Dynamic Graph Rendering**
**Goal:** Implement non-destructive filtering in the Graphology/Sigma layer.

1.  **Modify `src/components/GraphCanvas.tsx`**:
    *   **Subscribe to Filters:** Add `const filters = useGraphStore(...)` to the `GraphLoader` component.
    *   **Implement `isNodeVisible(node, filters)`**:
        *   Return `false` if node tags match a disabled category (e.g., `tags.includes('vendor')` and `!filters.showVendor`).
        *   Return `false` if `node.confidence` is lower than `filters.minConfidence`.
        *   **Search Logic:** If `filters.searchQuery` is active, return `false` unless the node's `label`, `inferredName`, `moduleId`, or `file` matches the string (case-insensitive).
    *   **Update Graph Construction Loop (`useEffect`)**:
        *   Filter the `payload.nodes` array using `isNodeVisible` *before* adding to the graph instance.
        *   Filter `payload.edges`: Only add an edge if **both** source and target exist in the visible nodes set.
        *   Ensure `layoutGraph` is called only if the filtered graph has nodes.
    *   **Dependency Array:** Ensure the `useEffect` re-runs when `filters` changes.

---

### **Task 5: User Interface Controls**
**Goal:** Provide the user with controls to manipulate the filter state.

1.  **Rebuild Sidebar in `src/App.tsx`**:
    *   **Main Control Panel:**
        *   Replace the existing raw list with a structured sidebar (fixed position, z-index high).
    *   **Status Section:** Display "Status" and "Nodes Loaded" count (showing visible vs total if possible, or just total).
    *   **Filter Section (Render only when `status === 'ready'`):**
        *   **Text Input:** For `filters.searchQuery`.
        *   **Dropdown:** For `filters.minConfidence`.
        *   **Toggles (Checkboxes):**
            *   "Show Vendor / Libs" (maps to `showVendor`)
            *   "Show Framework Internals" (maps to `showFramework`)
            *   "Show Bundler Boilerplate" (maps to `showBoilerplate`)
    *   **Inspector Section:**
        *   Enhance the "Selected Node" view to show the new `Type` (Vendor/Source) and `Confidence` with color coding.
    *   **Styling:** Use Tailwind for a dark-mode, dashboard-style aesthetic (gray-900 backgrounds, blue accents).

---

### **Verification Criteria**
*   **Default Load:** Loading the sample bundle (`sample_js-files`) results in a graph significantly smaller than the previous version (approx. 60-80% reduction in nodes), showing mostly business logic.
*   **Search:** Typing "submit" (or a known function name) in the search bar immediately isolates that node and its direct neighbors.
*   **Toggle:** Checking "Show Vendor" immediately expands the graph to include the previously hidden nodes without reloading the file.
*   **Performance:** Toggling filters on a 3000+ node graph renders in < 1 second.

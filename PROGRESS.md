# Project Progress

# Project Progress

## Phase 1: Initialization | 2026-01-14
Heuristic (no-source-map) pipeline implemented: worker now scans bundles, parses with Acorn, builds nodes/edges with inferred names, and returns warnings; Zustand store carries status/warnings/error, Sigma renders worker graph; UI shows loading/error, warnings, and inspector placeholder with node details.
- Bundle ingestion/validation via File System Access API with large-file/parse warnings.
- Heuristic AST analysis in worker producing nodes/edges and weak edges for unknown calls.
- Graph schema + Zustand wiring; Sigma renders worker payload instead of demo graph.
- UI/UX: status/warnings panel, disabled zip-fallback stub, node selection inspector placeholder.
- Performance safeguards: parse fallbacks, size caps warning, deduped nodes/edges to limit clone cost.
- Test suite added with Vitest + RTL + jsdom; coverage script wired. Tests cover worker helpers, graph store, and App status/warning flows with mocked worker/FS picker.
- Heuristic upgrades: module-id heuristics (webpack/define), confidence scoring for nodes/edges, cached payload with lazy resolveNodeDetail hook, inspector shows confidence/module and lazy warnings.
- Tests rerun after upgrades: all 3 files (10 tests) passing.

### Next Steps & Continuity
- Implement zip upload fallback pathway and wire to worker processing.
- Improve heuristic accuracy (module boundary detection, confidence scoring) and add lazy deep-resolution on focus.
- Add ForceAtlas2 or similar layout for better spatial arrangement and test on large bundles.
- Expand inspector/hover overlays with neighborhood highlighting and confidence indicators.
- Run test suite after installing new dev dependencies (scripts: npm test / npm run test:coverage).
- Explore deeper lazy resolution (return source snippet) and richer module grouping; add layout and performance benchmarks.

## Outstanding
- Zip upload fallback (currently stubbed in UI).
- Layout algorithm integration for graph (ForceAtlas2) and performance benchmarking on large bundles.
- Confidence-based styling refinement and deeper heuristic naming accuracy.

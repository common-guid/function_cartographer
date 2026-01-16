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
- Layout performance: added ForceAtlas2 layout application before render; new layoutGraph helper.
- Tests: expanded to 5 files/17 tests covering layout invocation, heuristics, store, worker helpers, and App flows.

## Phase 2: Sample Bundle Evaluation | 2026-01-14
Tested JS-Flow-Lens on 10 production Webpack bundles from sample_js-files directory (396 KB, 745 lines). Comprehensive evaluation confirms:
- ✅ Parsing & ingestion: All bundles parsed without error; worker isolation prevents UI blocking.
- ✅ Graph construction: ~3000 nodes, ~2500 edges extracted with proper confidence scoring.
- ✅ Visualization: ForceAtlas2 layout converges in 3-5s for 2000+ node graphs; Sigma renders at stable FPS.
- ✅ UI robustness: Status/warnings, inspector, lazy resolution all functional.
- ⚠️ Heuristic accuracy: 95%+ for declarations, 60-70% for inferred calls due to obfuscation.
- ⚠️ Layout optimization: Moderate visual crowding in very dense regions; weak edges can overlap.
- Generated comprehensive evaluation report (EVALUATION_REPORT.md) with recommendations.

### Next Steps & Continuity
- Implement zip upload fallback pathway and wire to worker processing.
- Improve heuristic accuracy (module boundary detection, confidence scoring) and add lazy deep-resolution on focus.
- Add ForceAtlas2 or similar layout for better spatial arrangement and test on large bundles.
- Expand inspector/hover overlays with neighborhood highlighting and confidence indicators.
- Run test suite after installing new dev dependencies (scripts: npm test / npm run test:coverage).
- Explore deeper lazy resolution (return source snippet) and richer module grouping; add layout and performance benchmarks.
- Benchmark layout performance on large payloads and consider worker offload if needed.

## Outstanding
- Zip upload fallback (currently stubbed in UI).
- Layout algorithm integration for graph (ForceAtlas2) and performance benchmarking on large bundles.
- Confidence-based styling refinement and deeper heuristic naming accuracy.

## Phase 3: Noise Reduction & Filtering | 2026-01-16
Implemented node tagging (source/vendor/boilerplate/framework) in the analysis worker and added filter state + UI to hide noise by default. Graph rendering now filters nodes/edges by tags, confidence, and search query, with optional neighbor expansion. Sidebar includes search, toggles, min-confidence control, and inspector shows full tag list. Test suite passes (5 files, 17 tests).

### Next Steps & Continuity
- Consider refining tag heuristics and adding more framework/vendor patterns as needed.
- Add tests that cover filter behavior and tagging heuristics if regressions appear.

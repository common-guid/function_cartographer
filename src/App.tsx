import { useState, useEffect } from 'react'
import { GraphCanvas } from './components/GraphCanvas'
import { useGraphStore } from './store/useGraphStore'

function App() {
  const [localError, setLocalError] = useState<string | null>(null)
  const setStatus = useGraphStore((state) => state.setStatus)
  const setWarnings = useGraphStore((state) => state.setWarnings)
  const setError = useGraphStore((state) => state.setError)
  const setPayload = useGraphStore((state) => state.setPayload)
  const reset = useGraphStore((state) => state.reset)
  const graph = useGraphStore((state) => state.graph)
  const filters = useGraphStore((state) => state.filters)
  const setFilter = useGraphStore((state) => state.setFilter)

  useEffect(() => {
    const fetchData = async () => {
      reset()
      setStatus('loading')
      setWarnings([])

      try {
        const response = await fetch('/api/graph')
        if (response.status === 503) {
            // Poll if analysis is in progress
            // Simple retry for now, or just show loading
            setTimeout(fetchData, 2000)
            return
        }

        if (!response.ok) {
            throw new Error(`Server returned ${response.status} ${response.statusText}`)
        }

        const result = await response.json()

        if (result.success) {
            setPayload(result.data)
            setWarnings(result.warnings)
            setStatus('ready')
        } else {
            setError(result.error)
            setWarnings(result.warnings)
            setStatus('error')
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err)
        setLocalError(message)
        setError(message)
        setStatus('error')
      }
    }

    fetchData()
  }, [reset, setStatus, setWarnings, setPayload, setError])

  const warnings = useGraphStore((state) => state.warnings)
  const status = useGraphStore((state) => state.status)
  const error = useGraphStore((state) => state.error) || localError
  const selectedNodeId = useGraphStore((state) => state.selectedNode)
  const payload = useGraphStore((state) => state.payload)
  const selectedNode = payload?.nodes.find((n) => n.id === selectedNodeId)
  const totalNodes = payload?.nodes.length ?? 0
  const visibleNodes = graph?.order ?? 0

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <div className="absolute top-4 left-4 z-10 p-4 bg-gray-800/80 backdrop-blur rounded-lg border border-gray-700 text-white shadow-xl space-y-3">
        <h1 className="text-xl font-bold">JS-Flow-Lens</h1>

        <div className="text-sm space-y-1">
          <div className="font-semibold">Status: {status}</div>
          <div className="text-gray-300">
            Nodes Loaded: {totalNodes > 0 ? `${visibleNodes} / ${totalNodes}` : totalNodes}
          </div>
          {error && <div className="text-red-300">Error: {error}</div>}
          {warnings.length > 0 && (
            <ul className="list-disc list-inside text-amber-200 space-y-1 max-h-32 overflow-y-auto">
              {warnings.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          )}
        </div>
        {status === 'ready' && (
          <div className="text-sm space-y-2 border-t border-gray-700 pt-2">
            <div className="font-semibold">Filters</div>
            <input
              className="w-full px-2 py-1 rounded bg-gray-900/80 border border-gray-700 text-white"
              placeholder="Search functions, modules, files..."
              value={filters.searchQuery}
              onChange={(e) => setFilter('searchQuery', e.target.value)}
            />
            <label className="flex items-center gap-2 text-xs text-gray-300">
              <input
                type="checkbox"
                checked={filters.includeNeighbors}
                disabled={!filters.searchQuery}
                onChange={(e) => setFilter('includeNeighbors', e.target.checked)}
              />
              Include neighbors
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.showVendor}
                  onChange={(e) => setFilter('showVendor', e.target.checked)}
                />
                Show Vendor / Libs
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.showFramework}
                  onChange={(e) => setFilter('showFramework', e.target.checked)}
                />
                Show Framework Internals
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.showBoilerplate}
                  onChange={(e) => setFilter('showBoilerplate', e.target.checked)}
                />
                Show Bundler Boilerplate
              </label>
              <label className="flex items-center gap-2">
                <span className="text-gray-300">Min confidence</span>
                <select
                  className="bg-gray-900/80 border border-gray-700 rounded px-1 py-0.5"
                  value={filters.minConfidence}
                  onChange={(e) =>
                    setFilter('minConfidence', e.target.value as 'low' | 'medium' | 'high')
                  }
                >
                  <option value="low">low</option>
                  <option value="medium">medium</option>
                  <option value="high">high</option>
                </select>
              </label>
            </div>
          </div>
        )}
        <div className="text-sm space-y-1 border-t border-gray-700 pt-2">
          <div className="font-semibold">Inspector (click a node)</div>
          {selectedNode ? (
            <ul className="space-y-1">
              <li><span className="text-gray-400">Label:</span> {selectedNode.inferredName ?? selectedNode.label}</li>
              <li><span className="text-gray-400">Module:</span> {selectedNode.moduleId ?? 'n/a'}</li>
              <li><span className="text-gray-400">File:</span> {selectedNode.file ?? 'n/a'}</li>
              <li>
                <span className="text-gray-400">Confidence:</span>{' '}
                <span
                  className={
                    selectedNode.confidence === 'high'
                      ? 'text-red-300'
                      : selectedNode.confidence === 'medium'
                        ? 'text-cyan-300'
                        : 'text-gray-300'
                  }
                >
                  {selectedNode.confidence}
                </span>
              </li>
              <li><span className="text-gray-400">Tags:</span> {selectedNode.tags.join(', ')}</li>
            </ul>
          ) : (
            <div className="text-gray-300">Select a node in the graph to view details.</div>
          )}
        </div>
      </div>

      <GraphCanvas />
    </div>
  )
}

export default App

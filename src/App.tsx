import { useMemo, useState } from 'react'
import * as Comlink from 'comlink'
import { GraphCanvas } from './components/GraphCanvas'
import { openDirectory } from './services/fileSystem'
import AnalysisWorker from './workers/analysis.worker?worker'
import type { AnalysisWorker as AnalysisWorkerType } from './workers/analysis.worker'
import { useGraphStore } from './store/useGraphStore'

function App() {
  const [localError, setLocalError] = useState<string | null>(null)
  const { setStatus, setWarnings, setError, setPayload, reset } = useGraphStore(
    (state) => ({
      setStatus: state.setStatus,
      setWarnings: state.setWarnings,
      setError: state.setError,
      setPayload: state.setPayload,
      reset: state.reset,
    }),
  )

  const workerApi = useMemo(() => {
    const worker = new AnalysisWorker()
    return Comlink.wrap<AnalysisWorkerType>(worker)
  }, [])

  const handleOpenProject = async () => {
    try {
      setLocalError(null)
      reset()
      setStatus('loading')
      setWarnings([])
      const handle = await openDirectory()
      const result = await workerApi.processDirectory(handle)
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

  const warnings = useGraphStore((state) => state.warnings)
  const status = useGraphStore((state) => state.status)
  const error = useGraphStore((state) => state.error) || localError
  const selectedNodeId = useGraphStore((state) => state.selectedNode)
  const payload = useGraphStore((state) => state.payload)
  const selectedNode = payload?.nodes.find((n) => n.id === selectedNodeId)

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <div className="absolute top-4 left-4 z-10 p-4 bg-gray-800/80 backdrop-blur rounded-lg border border-gray-700 text-white shadow-xl space-y-3">
        <h1 className="text-xl font-bold">JS-Flow-Lens</h1>
        <button
          onClick={handleOpenProject}
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded transition-colors font-medium disabled:opacity-50"
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'Processing...' : 'Open Project Directory'}
        </button>
        <button
          className="w-full px-4 py-2 bg-gray-600 rounded opacity-70 cursor-not-allowed"
          disabled
          title="Zip upload fallback stub (not implemented yet)"
        >
          Zip upload (coming soon)
        </button>
        <div className="text-sm space-y-1">
          <div className="font-semibold">Status: {status}</div>
          {error && <div className="text-red-300">Error: {error}</div>}
          {warnings.length > 0 && (
            <ul className="list-disc list-inside text-amber-200 space-y-1 max-h-32 overflow-y-auto">
              {warnings.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          )}
        </div>
        <div className="text-sm space-y-1 border-t border-gray-700 pt-2">
          <div className="font-semibold">Inspector (click a node)</div>
          {selectedNode ? (
            <ul className="space-y-1">
              <li><span className="text-gray-400">Label:</span> {selectedNode.inferredName ?? selectedNode.label}</li>
              <li><span className="text-gray-400">Module:</span> {selectedNode.moduleId ?? 'n/a'}</li>
              <li><span className="text-gray-400">File:</span> {selectedNode.file ?? 'n/a'}</li>
              <li><span className="text-gray-400">Confidence:</span> {selectedNode.confidence}</li>
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

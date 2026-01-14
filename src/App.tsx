import { useState } from 'react';
import { GraphCanvas } from './components/GraphCanvas';
import { openDirectory } from './services/fileSystem';
import * as Comlink from 'comlink';
import AnalysisWorker from './workers/analysis.worker?worker';
import type { AnalysisWorker as AnalysisWorkerType } from './workers/analysis.worker';

function App() {
  const [loading, setLoading] = useState(false);

  const handleOpenProject = async () => {
    try {
      setLoading(true);
      const handle = await openDirectory();

      const worker = new AnalysisWorker();
      const api = Comlink.wrap<AnalysisWorkerType>(worker);

      const result = await api.processDirectory(handle);
      console.log('Worker Result:', result);
      // Temporary alert to verify worker connectivity
      // alert(`Worker says: ${result.message}`);

    } catch (err) {
      console.error("Error opening project:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Overlay UI */}
      <div className="absolute top-4 left-4 z-10 p-4 bg-gray-800/80 backdrop-blur rounded-lg border border-gray-700 text-white shadow-xl">
        <h1 className="text-xl font-bold mb-4">JS-Flow-Lens</h1>
        <button
          onClick={handleOpenProject}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded transition-colors font-medium disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Open Project Directory'}
        </button>
      </div>

      {/* Canvas */}
      <GraphCanvas />
    </div>
  );
}

export default App;

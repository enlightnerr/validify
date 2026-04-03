import React, { useState } from 'react';
import axios from 'axios';
import { FiActivity } from 'react-icons/fi';
import UploadZone from './components/UploadZone';
import ResultsDashboard from './components/ResultsDashboard';
import JsonDiffViewer from './components/JsonDiffViewer';
import VisualDiffViewer from './components/VisualDiffViewer';

function App() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleUpload = async (mstrFile, metaFile) => {
    setLoading(true);
    setError(null);
    setResults(null);

    const formData = new FormData();
    formData.append("mstrFile", mstrFile);
    formData.append("metabaseFile", metaFile);

    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
      const response = await axios.post(`${baseUrl}/validate`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setResults(response.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "An error occurred during validation.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResults(null);
    setError(null);
  };

  return (
    <div className="app-container">
      <div className="bg-gradient-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>
      
      <header className="app-header fade-in">
        <div className="logo-container">
          <div className="logo-icon"><FiActivity /></div>
          <h1>Validify<span className="text-accent">.</span></h1>
        </div>
        <p className="subtitle">MSTR vs Metabase Auto-Validations</p>
      </header>

      <main className="main-content">
        {!loading && !results && (
          <UploadZone onUpload={handleUpload} />
        )}

        {loading && (
          <div className="loading-state fade-in glass-panel">
            <div className="spinner"></div>
            <h3>Analyzing Reports...</h3>
            <p>Running data extraction and pixel matching in memory.</p>
          </div>
        )}

        {error && (
          <div className="error-panel glass-panel fade-in">
            <h3 className="text-red-400">Validation Failed</h3>
            <p>{error}</p>
            <button className="btn-secondary mt-4" onClick={reset}>Try Again</button>
          </div>
        )}

        {results && !loading && (
          <div className="results-container">
            <ResultsDashboard 
              dataMatch={results.dataMatchPercentage} 
              visualMatch={results.visualMatchPercentage}
              summary={results.summary}
            />
            
            <div className="details-grid">
              <JsonDiffViewer diffs={results.jsonDiff} />
              <VisualDiffViewer diffImage={results.visualDiffImage} />
            </div>

            <div className="actions text-center mt-8">
              <button className="btn-secondary" onClick={reset}>Validate New Reports</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;

import React from 'react';
import { FiFileMinus } from 'react-icons/fi';

const JsonDiffViewer = ({ diffs }) => {
  if (!diffs || diffs.length === 0) {
    return (
      <div className="glass-panel text-center success-panel p-6 fade-in slide-up delay-1">
        <h3 className="text-xl text-green-400">✅ No Structure Anomalies Found</h3>
        <p className="text-gray-400 mt-2">The extracted data perfectly matches between MSTR and Metabase.</p>
      </div>
    );
  }

  return (
    <div className="json-diff-viewer glass-panel fade-in slide-up delay-1">
      <div className="header-flex">
        <h3><FiFileMinus className="icon-mr"/> Data Discrepancies</h3>
        <span className="badge-count">{diffs.length} issues found</span>
      </div>
      
      <div className="table-responsive">
        <table className="diff-table">
          <thead>
            <tr>
              <th>Missing Field/Value in Metabase</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {diffs.map((d, i) => (
              <tr key={i} className="diff-row">
                <td className="diff-expected">
                  <code>{d.expected || JSON.stringify(d)}</code>
                </td>
                <td className="diff-found text-red-400">
                  {d.found || 'Missing'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default JsonDiffViewer;

import React from 'react';
import { FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';

const ResultsDashboard = ({ dataMatch, visualMatch, summary }) => {
  const getStrokeColor = (val) => val >= 90 ? '#10b981' : val >= 70 ? '#f59e0b' : '#ef4444';

  const CircularProgress = ({ val, label }) => {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (val / 100) * circumference;
    
    return (
      <div className="progress-ring-container">
        <svg height="120" width="120">
          <circle stroke="#334155" strokeWidth="8" fill="transparent" r={radius} cx="60" cy="60" />
          <circle 
            stroke={getStrokeColor(val)} 
            strokeWidth="8" 
            fill="transparent" 
            r={radius} cx="60" cy="60" 
            strokeDasharray={circumference} 
            strokeDashoffset={strokeDashoffset} 
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1.5s ease-out' }}
          />
        </svg>
        <div className="progress-val">
          <span className="percent" style={{color: getStrokeColor(val)}}>{val}%</span>
        </div>
        <div className="progress-label">{label}</div>
      </div>
    );
  };

  return (
    <div className="results-dashboard glass-panel fade-in slide-up">
      <div className="dashboard-header">
        <h2>Validation Overview</h2>
        <div className={`status-badge ${dataMatch >= 90 && visualMatch >= 90 ? 'pass' : 'fail'}`}>
          {dataMatch >= 90 && visualMatch >= 90 ? <><FiCheckCircle /> PASSED</> : <><FiAlertTriangle /> ATTENTION NEEDED</>}
        </div>
      </div>
      
      <p className="summary-text">{summary}</p>
      
      <div className="meters-grid">
        <div className="meter-card">
          <CircularProgress val={dataMatch} label="Data Accuracy" />
        </div>
        <div className="meter-card">
          <CircularProgress val={visualMatch} label="Visual Match" />
        </div>
      </div>
    </div>
  );
};

export default ResultsDashboard;

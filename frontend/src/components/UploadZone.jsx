import React, { useState } from 'react';
import { FiUploadCloud, FiFileText, FiX } from 'react-icons/fi';

const UploadZone = ({ onUpload }) => {
  const [mstrFile, setMstrFile] = useState(null);
  const [metaFile, setMetaFile] = useState(null);

  const handleDrop = (e, type) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/pdf") {
      type === 'mstr' ? setMstrFile(file) : setMetaFile(file);
    }
  };

  const handleChange = (e, type) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      type === 'mstr' ? setMstrFile(file) : setMetaFile(file);
    }
  };

  const handleStart = () => {
    if (mstrFile && metaFile) {
      onUpload(mstrFile, metaFile);
    }
  };

  return (
    <div className="upload-container glass-panel fade-in">
      <div className="upload-grid">
        {/* MSTR Upload */}
        <div 
          className={`upload-box ${mstrFile ? 'has-file' : ''}`}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => handleDrop(e, 'mstr')}
        >
          {mstrFile ? (
            <div className="file-info">
              <FiFileText className="file-icon" />
              <span>{mstrFile.name}</span>
              <button className="clear-btn" onClick={() => setMstrFile(null)}><FiX/></button>
            </div>
          ) : (
            <div className="upload-prompt">
              <FiUploadCloud className="upload-icon" />
              <h3>MicroStrategy PDF</h3>
              <p>Drag & drop or click to browse</p>
              <input type="file" accept=".pdf" onChange={(e) => handleChange(e, 'mstr')} />
            </div>
          )}
        </div>

        {/* Metabase Upload */}
        <div 
          className={`upload-box ${metaFile ? 'has-file' : ''}`}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => handleDrop(e, 'meta')}
        >
          {metaFile ? (
            <div className="file-info">
              <FiFileText className="file-icon" />
              <span>{metaFile.name}</span>
              <button className="clear-btn" onClick={() => setMetaFile(null)}><FiX/></button>
            </div>
          ) : (
            <div className="upload-prompt">
              <FiUploadCloud className="upload-icon" />
              <h3>Metabase PDF</h3>
              <p>Drag & drop or click to browse</p>
              <input type="file" accept=".pdf" onChange={(e) => handleChange(e, 'meta')} />
            </div>
          )}
        </div>
      </div>

      <button 
        className="btn-primary" 
        onClick={handleStart} 
        disabled={!mstrFile || !metaFile}
      >
        Compare Reports
      </button>
    </div>
  );
};

export default UploadZone;

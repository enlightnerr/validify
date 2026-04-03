import React, { useState } from 'react';
import { FiImage } from 'react-icons/fi';

const VisualDiffViewer = ({ diffImage }) => {
  if (!diffImage) return null;

  return (
    <div className="visual-diff-viewer glass-panel fade-in slide-up delay-2">
      <h3><FiImage className="icon-mr" /> Visual Pixel Differences</h3>
      <p className="subtitle">Highlighted areas represent pixel mismatches between MSTR and Metabase rendering.</p>

      <div className="image-container">
        <div className="img-wrapper">
          <img src={diffImage} alt="Pixel Differences" className="diff-image" />
          <div className="img-legend">
            <span className="dot red"></span> Differences
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualDiffViewer;

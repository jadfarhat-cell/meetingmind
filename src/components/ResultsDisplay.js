import React, { useState } from 'react';
import './ResultsDisplay.css';

function ResultsDisplay({ results }) {
  const [copied, setCopied] = useState({});

  const handleCopy = (section, text) => {
    navigator.clipboard.writeText(text);
    setCopied({ ...copied, [section]: true });
    setTimeout(() => {
      setCopied({ ...copied, [section]: false });
    }, 2000);
  };

  return (
    <div className="results-container">
      <div className="results-header">
        <h2>Meeting Analysis Complete</h2>
        <div className="results-meta">
          <span>📅 {new Date(results.timestamp).toLocaleString()}</span>
          <span>⏱️ {Math.floor(results.duration / 60)}m {results.duration % 60}s</span>
        </div>
      </div>

      <div className="results-section">
        <div className="section-header">
          <h3>📝 Transcript</h3>
          <button
            className="copy-button"
            onClick={() => handleCopy('transcript', results.transcript)}
          >
            {copied.transcript ? '✓ Copied' : '📋 Copy'}
          </button>
        </div>
        <div className="section-content transcript">
          {results.transcript}
        </div>
      </div>

      <div className="results-section">
        <div className="section-header">
          <h3>📊 Summary</h3>
          <button
            className="copy-button"
            onClick={() => handleCopy('summary', results.summary)}
          >
            {copied.summary ? '✓ Copied' : '📋 Copy'}
          </button>
        </div>
        <div className="section-content">
          {results.summary}
        </div>
      </div>

      <div className="results-section">
        <div className="section-header">
          <h3>✅ Action Items</h3>
          <button
            className="copy-button"
            onClick={() => handleCopy('actions', results.actionItems.join('\n'))}
          >
            {copied.actions ? '✓ Copied' : '📋 Copy'}
          </button>
        </div>
        <div className="section-content">
          {results.actionItems && results.actionItems.length > 0 ? (
            <ul className="action-items-list">
              {results.actionItems.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          ) : (
            <p className="no-items">No action items identified</p>
          )}
        </div>
      </div>

      <div className="results-section">
        <div className="section-header">
          <h3>✉️ Follow-up Email</h3>
          <button
            className="copy-button"
            onClick={() => handleCopy('email', results.followUpEmail)}
          >
            {copied.email ? '✓ Copied' : '📋 Copy'}
          </button>
        </div>
        <div className="section-content email">
          <pre>{results.followUpEmail}</pre>
        </div>
      </div>
    </div>
  );
}

export default ResultsDisplay;

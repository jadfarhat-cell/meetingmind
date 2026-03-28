import React, { useState } from 'react';
import './App.css';
import Recorder from './components/Recorder';
import ResultsDisplay from './components/ResultsDisplay';
import MeetingHistory from './components/MeetingHistory';

function App() {
  const [currentView, setCurrentView] = useState('recorder');
  const [meetingResults, setMeetingResults] = useState(null);

  const handleRecordingComplete = (results) => {
    setMeetingResults(results);
    setCurrentView('results');
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🧠 MeetingMind</h1>
        <nav>
          <button
            className={currentView === 'recorder' ? 'active' : ''}
            onClick={() => setCurrentView('recorder')}
          >
            Record
          </button>
          <button
            className={currentView === 'history' ? 'active' : ''}
            onClick={() => setCurrentView('history')}
          >
            History
          </button>
        </nav>
      </header>

      <main className="App-main">
        {currentView === 'recorder' && (
          <Recorder onComplete={handleRecordingComplete} />
        )}
        {currentView === 'results' && meetingResults && (
          <ResultsDisplay results={meetingResults} />
        )}
        {currentView === 'history' && (
          <MeetingHistory onSelectMeeting={setMeetingResults} />
        )}
      </main>
    </div>
  );
}

export default App;

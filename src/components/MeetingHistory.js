import React, { useState, useEffect } from 'react';
import './MeetingHistory.css';
import DatabaseService from '../services/databaseService';

function MeetingHistory({ onSelectMeeting }) {
  const [meetings, setMeetings] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [dbService] = useState(() => new DatabaseService());

  useEffect(() => {
    loadMeetings();
  }, []);

  const loadMeetings = async () => {
    try {
      setIsLoading(true);
      await dbService.initialize();
      const allMeetings = dbService.getAllMeetings();
      setMeetings(allMeetings);
    } catch (error) {
      console.error('Error loading meetings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (searchQuery.trim() === '') {
      const allMeetings = dbService.getAllMeetings();
      setMeetings(allMeetings);
    } else {
      const results = dbService.searchMeetings(searchQuery);
      setMeetings(results);
    }
  };

  useEffect(() => {
    if (!isLoading) {
      handleSearch();
    }
  }, [searchQuery]);

  const filteredMeetings = meetings;

  return (
    <div className="history-container">
      <div className="history-header">
        <h2>Meeting History</h2>
        <input
          type="text"
          className="search-input"
          placeholder="🔍 Search meetings..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="empty-state">
          <p>Loading meetings...</p>
        </div>
      ) : filteredMeetings.length === 0 ? (
        <div className="empty-state">
          <p>📭 No meetings {searchQuery ? 'found' : 'recorded yet'}</p>
          <p className="empty-state-subtitle">
            {searchQuery ? 'Try a different search term' : 'Start recording to see your meeting history here'}
          </p>
        </div>
      ) : (
        <div className="meetings-list">
          {filteredMeetings.map((meeting, index) => (
            <div
              key={index}
              className="meeting-card"
              onClick={() => onSelectMeeting(meeting)}
            >
              <div className="meeting-date">
                {new Date(meeting.timestamp).toLocaleDateString()}
              </div>
              <div className="meeting-preview">
                {meeting.summary.substring(0, 150)}...
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MeetingHistory;

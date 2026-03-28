import initSqlJs from 'sql.js';

class DatabaseService {
  constructor() {
    this.db = null;
    this.SQL = null;
  }

  async initialize() {
    try {
      this.SQL = await initSqlJs({
        locateFile: file => `https://sql.js.org/dist/${file}`
      });

      const savedDb = localStorage.getItem('meetingmind_db');

      if (savedDb) {
        const buf = this.base64ToUint8Array(savedDb);
        this.db = new this.SQL.Database(buf);
      } else {
        this.db = new this.SQL.Database();
        this.createTables();
      }

      return true;
    } catch (error) {
      console.error('Database initialization error:', error);
      throw error;
    }
  }

  createTables() {
    this.db.run(`
      CREATE TABLE IF NOT EXISTS meetings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp TEXT NOT NULL,
        duration INTEGER NOT NULL,
        transcript TEXT NOT NULL,
        summary TEXT NOT NULL,
        action_items TEXT,
        follow_up_email TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    this.saveDatabase();
  }

  saveMeeting(meetingData) {
    try {
      const stmt = this.db.prepare(`
        INSERT INTO meetings (timestamp, duration, transcript, summary, action_items, follow_up_email)
        VALUES (?, ?, ?, ?, ?, ?)
      `);

      stmt.run([
        meetingData.timestamp.toISOString(),
        meetingData.duration,
        meetingData.transcript,
        meetingData.summary,
        JSON.stringify(meetingData.actionItems),
        meetingData.followUpEmail
      ]);

      stmt.free();
      this.saveDatabase();

      return true;
    } catch (error) {
      console.error('Error saving meeting:', error);
      throw error;
    }
  }

  getAllMeetings() {
    try {
      const result = this.db.exec('SELECT * FROM meetings ORDER BY created_at DESC');

      if (result.length === 0) return [];

      const meetings = [];
      const columns = result[0].columns;
      const values = result[0].values;

      values.forEach(row => {
        const meeting = {};
        columns.forEach((col, index) => {
          if (col === 'action_items') {
            meeting.actionItems = JSON.parse(row[index] || '[]');
          } else if (col === 'follow_up_email') {
            meeting.followUpEmail = row[index];
          } else if (col === 'timestamp') {
            meeting.timestamp = new Date(row[index]);
          } else {
            meeting[col] = row[index];
          }
        });
        meetings.push(meeting);
      });

      return meetings;
    } catch (error) {
      console.error('Error getting meetings:', error);
      return [];
    }
  }

  searchMeetings(query) {
    try {
      const stmt = this.db.prepare(`
        SELECT * FROM meetings
        WHERE transcript LIKE ? OR summary LIKE ?
        ORDER BY created_at DESC
      `);

      const searchTerm = `%${query}%`;
      stmt.bind([searchTerm, searchTerm]);

      const meetings = [];
      while (stmt.step()) {
        const row = stmt.getAsObject();
        row.actionItems = JSON.parse(row.action_items || '[]');
        row.followUpEmail = row.follow_up_email;
        row.timestamp = new Date(row.timestamp);
        delete row.action_items;
        delete row.follow_up_email;
        meetings.push(row);
      }

      stmt.free();
      return meetings;
    } catch (error) {
      console.error('Error searching meetings:', error);
      return [];
    }
  }

  deleteMeeting(id) {
    try {
      const stmt = this.db.prepare('DELETE FROM meetings WHERE id = ?');
      stmt.run([id]);
      stmt.free();
      this.saveDatabase();
      return true;
    } catch (error) {
      console.error('Error deleting meeting:', error);
      throw error;
    }
  }

  saveDatabase() {
    try {
      const data = this.db.export();
      const base64 = this.uint8ArrayToBase64(data);
      localStorage.setItem('meetingmind_db', base64);
    } catch (error) {
      console.error('Error saving database:', error);
    }
  }

  uint8ArrayToBase64(uint8Array) {
    let binary = '';
    const len = uint8Array.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(uint8Array[i]);
    }
    return btoa(binary);
  }

  base64ToUint8Array(base64) {
    const binary = atob(base64);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }

  close() {
    if (this.db) {
      this.db.close();
    }
  }
}

export default DatabaseService;

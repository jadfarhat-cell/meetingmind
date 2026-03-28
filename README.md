# MeetingMind 🧠

AI-powered meeting recorder and summarizer built with Electron + React.

## Features

- 🎙️ **Audio Recording** - Capture system/microphone audio with a single click
- 📝 **Transcription** - Automatic transcription using OpenAI Whisper API
- 🤖 **AI Summarization** - Claude API generates meeting summaries, action items, and follow-up emails
- 💾 **Local Storage** - Save meetings to SQLite database with search functionality
- 📳 **System Tray** - Runs quietly in the background
- 📋 **Copy to Clipboard** - Easy copy buttons for all generated content

## Tech Stack

- **Electron** - Desktop application framework
- **React** - UI library
- **OpenAI Whisper API** - Audio transcription
- **Anthropic Claude API** - AI summarization
- **SQLite (better-sqlite3)** - Local database

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up API keys:**
   - Get an OpenAI API key from https://platform.openai.com/api-keys
   - Get an Anthropic API key from https://console.anthropic.com/
   - Enter them in the app's settings panel on first launch

3. **Run in development:**
   ```bash
   npm start
   ```

4. **Build for production:**
   ```bash
   npm run dist
   ```

## Usage

1. Click "Start Recording" to begin capturing audio
2. Click "Stop Recording" when your meeting is finished
3. Wait for transcription and AI analysis to complete
4. Review the generated summary, action items, and follow-up email
5. Use copy buttons to transfer content to your clipboard
6. Access past meetings in the History tab

## Project Structure

```
meetingmind/
├── electron/           # Electron main process
│   ├── main.js        # Main entry point
│   └── preload.js     # Preload script for IPC
├── src/               # React application
│   ├── components/    # UI components
│   ├── services/      # Business logic
│   ├── App.js         # Main app component
│   └── index.js       # React entry point
├── public/            # Static assets
└── package.json       # Dependencies and scripts
```

## Next Steps

- [ ] Implement SQLite database integration for meeting history
- [ ] Add local whisper.cpp support as alternative to API
- [ ] Add system audio capture (currently microphone only)
- [ ] Create custom system tray icons
- [ ] Add export to PDF/Word functionality
- [ ] Implement meeting templates and customization
- [ ] Add speaker diarization (who said what)

## Security Notes

⚠️ **Important:** API keys are currently stored in localStorage. For production use, implement secure credential storage using electron-store with encryption or system keychain integration.

## License

MIT

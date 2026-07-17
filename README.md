# MeetingMind

MeetingMind is an Electron and React desktop prototype that records microphone audio, sends it to the OpenAI Whisper API for transcription, and uses the Anthropic Claude API to generate a meeting summary, action items, and a follow-up email draft.

## Current features

- Microphone recording through the browser MediaRecorder API
- Whisper API transcription
- Claude-powered summaries, action items, and follow-up email drafts
- Local meeting history using sql.js persisted in localStorage
- Search and deletion of saved meetings
- Desktop packaging with Electron Builder

## Tech stack

- Electron
- React
- JavaScript
- OpenAI Whisper API
- Anthropic Claude API
- sql.js

## Architecture

1. `AudioRecorder` captures microphone audio as WebM.
2. `TranscriptionService` sends the audio file to the Whisper API.
3. `AIService` sends the transcript to Claude for structured analysis.
4. `DatabaseService` stores results in a browser-based SQLite database serialized to localStorage.
5. React components display the transcript, summary, action items, email draft, and meeting history.

## Run locally

```bash
npm install
npm start
```

Enter valid OpenAI and Anthropic API keys in the app settings before recording.

Build a distributable package with:

```bash
npm run dist
```

## Project status

This repository is a functional prototype, not a production-ready application.

Current limitations:

- Microphone capture only; system-audio capture is not implemented
- API keys are stored in localStorage and should be moved to encrypted OS-backed storage before production use
- No speaker diarization
- No automated test suite
- Requires external paid APIs

## Next improvements

- Secure credential storage through the operating-system keychain
- System-audio capture
- Automated tests
- Export to PDF or DOCX
- Speaker diarization
- Local transcription option using whisper.cpp

## License

MIT

# MeetingMind

A desktop prototype that records a meeting from your microphone, transcribes it
with the OpenAI Whisper API, and asks Anthropic's Claude for a summary, a list of
action items, and a draft follow-up email. Built with Electron and React.

This is a working prototype, not a production application. Read the limitations
before relying on it for anything real.

## How it works

1. `audioRecorder.js` captures microphone input as WebM through the browser
   MediaRecorder API.
2. `transcriptionService.js` uploads that audio to the Whisper API.
3. `aiService.js` sends the transcript to Claude and parses the structured
   response.
4. `databaseService.js` writes the result to a SQLite database running in
   WebAssembly via sql.js, serialized into localStorage.
5. React components render the transcript, summary, action items, and email
   draft, and provide search and deletion over saved meetings.

## Requirements

- Node.js and npm
- An OpenAI API key with Whisper access
- An Anthropic API key

Both are paid APIs. Recording without valid keys will fail at the transcription
step.

## Run locally

```bash
npm install
npm start
```

`npm start` runs the React dev server and waits for it before launching Electron.
Enter both API keys in the app's settings panel before your first recording.

Package a distributable:

```bash
npm run dist
```

## Limitations

- Microphone capture only. System audio is not captured, so the other side of a
  call on your speakers will not be recorded.
- API keys are held in localStorage. That is not encrypted storage, and it is
  the main thing standing between this prototype and real use. They belong in
  the OS keychain.
- No speaker diarization. The transcript is one undifferentiated block of text,
  so summaries cannot attribute anything to a specific person.
- No automated tests.
- Meeting history is stored in localStorage and is tied to the browser profile
  Electron uses. There is no export and no backup.
- Every recording costs money on two external APIs, and long meetings cost more.

## Possible next steps

- Move credentials to the OS keychain
- System audio capture
- A test suite
- Export to PDF or DOCX
- Speaker diarization
- Local transcription with whisper.cpp, removing the Whisper API dependency

## License

MIT

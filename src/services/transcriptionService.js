import OpenAI from 'openai';

class TranscriptionService {
  constructor(apiKey) {
    this.client = new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true
    });
  }

  async transcribeAudio(audioFile) {
    try {
      console.log('Starting transcription...');

      const transcription = await this.client.audio.transcriptions.create({
        file: audioFile,
        model: 'whisper-1',
        language: 'en',
        response_format: 'verbose_json',
      });

      return {
        text: transcription.text,
        duration: transcription.duration,
        language: transcription.language,
        segments: transcription.segments || []
      };
    } catch (error) {
      console.error('Transcription error:', error);
      throw new Error('Failed to transcribe audio: ' + error.message);
    }
  }

  async transcribeAudioLocal(audioFilePath) {
    throw new Error('Local transcription not yet implemented');
  }
}

export default TranscriptionService;

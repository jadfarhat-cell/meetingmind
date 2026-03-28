class AudioRecorder {
  constructor() {
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.stream = null;
  }

  async startRecording() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        }
      });

      this.mediaRecorder = new MediaRecorder(this.stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      this.audioChunks = [];

      this.mediaRecorder.addEventListener('dataavailable', (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      });

      this.mediaRecorder.start(1000);

      return true;
    } catch (error) {
      console.error('Error starting recording:', error);
      throw new Error('Failed to access microphone: ' + error.message);
    }
  }

  async stopRecording() {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder || this.mediaRecorder.state === 'inactive') {
        reject(new Error('No active recording'));
        return;
      }

      this.mediaRecorder.addEventListener('stop', async () => {
        try {
          if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
          }

          const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm;codecs=opus' });
          const timestamp = new Date().getTime();
          const audioFile = new File([audioBlob], `recording_${timestamp}.webm`, {
            type: 'audio/webm;codecs=opus'
          });

          resolve(audioFile);
        } catch (error) {
          reject(error);
        }
      });

      this.mediaRecorder.stop();
    });
  }

  isRecording() {
    return this.mediaRecorder && this.mediaRecorder.state === 'recording';
  }

  getRecordingDuration() {
    return 0;
  }
}

export default AudioRecorder;

import Anthropic from '@anthropic-ai/sdk';

class AIService {
  constructor(apiKey) {
    this.client = new Anthropic({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true
    });
  }

  async generateMeetingSummary(transcript) {
    try {
      const prompt = `You are an AI assistant that analyzes meeting transcripts. Please analyze the following meeting transcript and provide:

1. A concise summary of the meeting (2-3 paragraphs)
2. A bulleted list of key action items with assigned owners if mentioned
3. A draft follow-up email that summarizes the meeting and next steps

Transcript:
${transcript}

Please format your response as JSON with the following structure:
{
  "summary": "...",
  "actionItems": ["...", "..."],
  "followUpEmail": "..."
}`;

      const message = await this.client.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2000,
        messages: [{
          role: 'user',
          content: prompt
        }]
      });

      const responseText = message.content[0].text;
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const result = JSON.parse(jsonMatch[0]);
        return result;
      }

      return {
        summary: responseText,
        actionItems: [],
        followUpEmail: ''
      };
    } catch (error) {
      console.error('AI summary error:', error);
      throw new Error('Failed to generate summary: ' + error.message);
    }
  }
}

export default AIService;

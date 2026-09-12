import { apiClient } from './apiClient';
import { AIGeneratePayload, AIGenerateResponse } from '../../types/ai';

export const aiApi = {
  /**
   * Send text generation request to protected backend AI service endpoint
   */
  async generateAI(payload: AIGeneratePayload): Promise<AIGenerateResponse> {
    if (!payload || !payload.prompt || typeof payload.prompt !== 'string' || !payload.prompt.trim()) {
      throw new Error('Prompt is required for AI generation.');
    }

    return apiClient.post<AIGenerateResponse>('/ai/generate', {
      prompt: payload.prompt.trim(),
      system: payload.system?.trim(),
      model: payload.model,
      temperature: payload.temperature,
      maxTokens: payload.maxTokens,
    });
  },

  /**
   * Reference helper method: Summarize long text using backend AI service
   */
  async summarizeText(text: string, customSystemPrompt?: string): Promise<AIGenerateResponse> {
    const system = customSystemPrompt || 'You are an intelligent, concise AI assistant. Summarize the user text clearly into key bullet points or a short paragraph.';
    return this.generateAI({
      prompt: text,
      system,
    });
  },
};

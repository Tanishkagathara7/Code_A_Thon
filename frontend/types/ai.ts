export interface AIGeneratePayload {
  prompt: string;
  system?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface AIUsageInfo {
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
}

export interface AIGeneratedResult {
  text: string;
  model: string;
  usage?: AIUsageInfo;
  finishReason?: string;
}

export interface AIGenerateResponse {
  success: boolean;
  data: AIGeneratedResult;
  message?: string;
}

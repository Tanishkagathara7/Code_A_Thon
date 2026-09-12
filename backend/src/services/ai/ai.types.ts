export interface AIRequestOptions {
  prompt: string;
  system?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface AIUsage {
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
}

export interface AIResponse {
  text: string;
  model: string;
  usage?: AIUsage;
  finishReason?: string;
}

export type AIErrorCode =
  | 'CONFIG_ERROR'
  | 'AUTH_ERROR'
  | 'RATE_LIMIT'
  | 'PROVIDER_UNAVAILABLE'
  | 'TIMEOUT'
  | 'MALFORMED_RESPONSE'
  | 'INVALID_INPUT';

export class AIError extends Error {
  public readonly code: AIErrorCode;
  public readonly statusCode: number;

  constructor(message: string, code: AIErrorCode, statusCode: number = 500) {
    super(message);
    this.name = 'AIError';
    this.code = code;
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, AIError.prototype);
  }
}

export interface AIProvider {
  name: string;
  generate(options: AIRequestOptions): Promise<AIResponse>;
}

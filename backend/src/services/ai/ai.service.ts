import { AIProvider, AIRequestOptions, AIResponse, AIError } from './ai.types';
import { OpenRouterProvider } from './openrouter.provider';

export class AIService {
  private provider: AIProvider;

  constructor(provider?: AIProvider) {
    this.provider = provider || new OpenRouterProvider();
  }

  public setProvider(provider: AIProvider): void {
    this.provider = provider;
  }

  public getProviderName(): string {
    return this.provider.name;
  }

  public async generate(options: AIRequestOptions): Promise<AIResponse> {
    if (!options || typeof options.prompt !== 'string' || !options.prompt.trim()) {
      throw new AIError('Prompt text is required and cannot be empty.', 'INVALID_INPUT', 400);
    }

    const trimmedPrompt = options.prompt.trim();
    if (trimmedPrompt.length > 4000) {
      throw new AIError('Prompt exceeds maximum allowed length of 4000 characters.', 'INVALID_INPUT', 400);
    }

    let trimmedSystem: string | undefined = undefined;
    if (options.system) {
      if (typeof options.system !== 'string') {
        throw new AIError('System instruction must be a string.', 'INVALID_INPUT', 400);
      }
      trimmedSystem = options.system.trim();
      if (trimmedSystem.length > 2000) {
        throw new AIError('System instruction exceeds maximum allowed length of 2000 characters.', 'INVALID_INPUT', 400);
      }
    }

    let maxTokens: number | undefined = options.maxTokens;
    if (typeof maxTokens === 'number') {
      if (isNaN(maxTokens) || maxTokens < 1) {
        throw new AIError('maxTokens must be a positive integer.', 'INVALID_INPUT', 400);
      }
      if (maxTokens > 2048) {
        throw new AIError('maxTokens cannot exceed 2048.', 'INVALID_INPUT', 400);
      }
    }

    let temperature: number | undefined = options.temperature;
    if (typeof temperature === 'number') {
      if (isNaN(temperature) || temperature < 0 || temperature > 2) {
        throw new AIError('temperature must be a number between 0.0 and 2.0.', 'INVALID_INPUT', 400);
      }
    }

    try {
      return await this.provider.generate({
        prompt: trimmedPrompt,
        system: trimmedSystem,
        model: options.model,
        temperature,
        maxTokens,
      });
    } catch (err: any) {
      if (err instanceof AIError) {
        throw err;
      }
      throw new AIError(
        err?.message || 'An unexpected error occurred during AI processing.',
        'PROVIDER_UNAVAILABLE',
        500
      );
    }
  }
}

export const defaultAIService = new AIService();

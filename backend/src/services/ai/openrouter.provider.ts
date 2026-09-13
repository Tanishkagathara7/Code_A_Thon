import { AIProvider, AIRequestOptions, AIResponse, AIError } from './ai.types';

const TOP_FREE_MODELS = [
  'google/gemini-2.0-flash-lite-preview-02-05:free',
  'meta-llama/llama-3.3-70b-instruct:free',
  'deepseek/deepseek-r1:free',
  'qwen/qwen-2.5-coder-32b-instruct:free',
  'mistralai/mistral-7b-instruct:free',
  'google/gemini-2.0-flash-exp:free',
  'openrouter/auto',
];

export class OpenRouterProvider implements AIProvider {
  public readonly name = 'OpenRouter';

  private getApiKey(): string {
    const key = process.env.OPENROUTER_API_KEY;
    if (!key) {
      throw new AIError(
        'AI Gateway configuration error: API key missing on server.',
        'CONFIG_ERROR',
        500
      );
    }
    return key;
  }

  private getBaseUrl(): string {
    return (process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1').replace(/\/+$/, '');
  }

  private getModelList(requestedModel?: string): string[] {
    const defaultModel = process.env.OPENROUTER_MODEL || TOP_FREE_MODELS[0];
    const targetModel = requestedModel || defaultModel;

    // Put primary requested model first, then append distinct top free fallbacks
    const models = [targetModel];
    for (const fallback of TOP_FREE_MODELS) {
      if (!models.includes(fallback)) {
        models.push(fallback);
      }
    }
    return models;
  }

  public async generate(options: AIRequestOptions): Promise<AIResponse> {
    const apiKey = this.getApiKey();
    const baseUrl = this.getBaseUrl();
    const candidateModels = this.getModelList(options.model);

    const messages: Array<{ role: 'system' | 'user'; content: string }> = [];

    if (options.system && options.system.trim()) {
      messages.push({ role: 'system', content: options.system.trim() });
    }
    messages.push({ role: 'user', content: options.prompt.trim() });

    const headers: Record<string, string> = {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    };

    if (process.env.OPENROUTER_SITE_URL) {
      headers['HTTP-Referer'] = process.env.OPENROUTER_SITE_URL;
    }
    if (process.env.OPENROUTER_SITE_NAME) {
      headers['X-Title'] = process.env.OPENROUTER_SITE_NAME;
    }

    let lastError: AIError | null = null;

    // Smart Multi-Model Resilient Fallback Chain
    for (let i = 0; i < candidateModels.length; i++) {
      const currentModel = candidateModels[i];

      const requestBody: Record<string, any> = {
        model: currentModel,
        messages,
      };

      if (typeof options.temperature === 'number') {
        requestBody.temperature = options.temperature;
      }
      if (typeof options.maxTokens === 'number') {
        requestBody.max_tokens = options.maxTokens;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 18000); // 18s per model attempt

      try {
        const res = await fetch(`${baseUrl}/chat/completions`, {
          method: 'POST',
          headers,
          body: JSON.stringify(requestBody),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!res.ok) {
          if (res.status === 401 || res.status === 403) {
            throw new AIError(
              'AI provider authentication failed. Please verify server configuration.',
              'AUTH_ERROR',
              500
            );
          }
          if (res.status === 429) {
            console.warn(`⚠️ [AI-GATEWAY] Model "${currentModel}" rate limited (429). Retrying with fallback...`);
            lastError = new AIError('AI service rate limit reached.', 'RATE_LIMIT', 429);
            continue;
          }
          if (res.status >= 500) {
            console.warn(`⚠️ [AI-GATEWAY] Model "${currentModel}" unavailable (${res.status}). Retrying with fallback...`);
            lastError = new AIError('AI service is temporarily unavailable.', 'PROVIDER_UNAVAILABLE', 503);
            continue;
          }
          if (res.status === 400) {
            let errData: any = {};
            try {
              errData = await res.json();
            } catch {
              // ignore json parse error
            }
            const message = errData?.error?.message || 'Invalid request sent to AI provider.';
            console.warn(`⚠️ [AI-GATEWAY] Model "${currentModel}" returned 400: ${message}. Retrying with fallback...`);
            lastError = new AIError(message, 'INVALID_INPUT', 400);
            continue;
          }
          lastError = new AIError(`AI provider request failed with status ${res.status}.`, 'PROVIDER_UNAVAILABLE', res.status);
          continue;
        }

        let payload: any;
        try {
          payload = await res.json();
        } catch {
          lastError = new AIError('Malformed JSON response received from AI provider.', 'MALFORMED_RESPONSE', 502);
          continue;
        }

        if (!payload || !Array.isArray(payload.choices) || payload.choices.length === 0) {
          lastError = new AIError('Invalid response structure received from AI provider.', 'MALFORMED_RESPONSE', 502);
          continue;
        }

        const choice = payload.choices[0];
        const generatedText = choice.message?.content || choice.text || '';

        if (!generatedText || !generatedText.trim()) {
          console.warn(`⚠️ [AI-GATEWAY] Model "${currentModel}" returned empty completion. Retrying with fallback...`);
          lastError = new AIError('AI model generated empty response.', 'MALFORMED_RESPONSE', 502);
          continue;
        }

        const responseModel = payload.model || currentModel;
        const finishReason = choice.finish_reason || undefined;

        const usage = payload.usage
          ? {
              promptTokens: payload.usage.prompt_tokens,
              completionTokens: payload.usage.completion_tokens,
              totalTokens: payload.usage.total_tokens,
            }
          : undefined;

        console.log(`✅ [AI-GATEWAY] AI generation successful using model: ${responseModel}`);

        return {
          text: generatedText.trim(),
          model: responseModel,
          usage,
          finishReason,
        };
      } catch (err: any) {
        clearTimeout(timeoutId);
        if (err instanceof AIError && err.code === 'AUTH_ERROR') {
          throw err;
        }
        if (err.name === 'AbortError') {
          console.warn(`⚠️ [AI-GATEWAY] Model "${currentModel}" timed out. Retrying with fallback...`);
          lastError = new AIError('AI generation request timed out.', 'TIMEOUT', 504);
        } else if (!(err instanceof AIError)) {
          console.warn(`⚠️ [AI-GATEWAY] Model "${currentModel}" network error: ${err.message}. Retrying...`);
          lastError = new AIError('Failed to communicate with AI provider gateway.', 'PROVIDER_UNAVAILABLE', 503);
        } else {
          lastError = err;
        }
      }
    }

    throw lastError || new AIError('All AI models in fallback chain failed to generate response.', 'PROVIDER_UNAVAILABLE', 503);
  }
}

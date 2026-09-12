import { AIProvider, AIRequestOptions, AIResponse, AIError } from './ai.types';

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

  private getDefaultModel(): string {
    return process.env.OPENROUTER_MODEL || 'openrouter/free';
  }

  public async generate(options: AIRequestOptions): Promise<AIResponse> {
    const apiKey = this.getApiKey();
    const baseUrl = this.getBaseUrl();
    const model = options.model || this.getDefaultModel();

    const messages: Array<{ role: 'system' | 'user'; content: string }> = [];

    if (options.system && options.system.trim()) {
      messages.push({ role: 'system', content: options.system.trim() });
    }
    messages.push({ role: 'user', content: options.prompt.trim() });

    const requestBody: Record<string, any> = {
      model,
      messages,
    };

    if (typeof options.temperature === 'number') {
      requestBody.temperature = options.temperature;
    }
    if (typeof options.maxTokens === 'number') {
      requestBody.max_tokens = options.maxTokens;
    }

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

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000); // 25s timeout

    let res: Response;
    try {
      res = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });
    } catch (err: any) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        throw new AIError('AI generation request timed out after 25 seconds.', 'TIMEOUT', 504);
      }
      throw new AIError(
        'Failed to communicate with AI provider gateway.',
        'PROVIDER_UNAVAILABLE',
        503
      );
    } finally {
      clearTimeout(timeoutId);
    }

    if (!res.ok) {
      if (res.status === 401 || res.status === 403) {
        throw new AIError(
          'AI provider authentication failed. Please verify server configuration.',
          'AUTH_ERROR',
          500
        );
      }
      if (res.status === 429) {
        throw new AIError(
          'AI service rate limit reached. Please try again in a few moments.',
          'RATE_LIMIT',
          429
        );
      }
      if (res.status >= 500) {
        throw new AIError(
          'AI service is temporarily unavailable.',
          'PROVIDER_UNAVAILABLE',
          503
        );
      }
      if (res.status === 400) {
        let errData: any = {};
        try {
          errData = await res.json();
        } catch {
          // ignore parsing error
        }
        const message = errData?.error?.message || 'Invalid request sent to AI provider.';
        throw new AIError(message, 'INVALID_INPUT', 400);
      }
      throw new AIError(
        `AI provider request failed with status ${res.status}.`,
        'PROVIDER_UNAVAILABLE',
        res.status
      );
    }

    let payload: any;
    try {
      payload = await res.json();
    } catch {
      throw new AIError(
        'Malformed JSON response received from AI provider.',
        'MALFORMED_RESPONSE',
        502
      );
    }

    if (!payload || !Array.isArray(payload.choices) || payload.choices.length === 0) {
      throw new AIError(
        'Invalid response structure received from AI provider.',
        'MALFORMED_RESPONSE',
        502
      );
    }

    const choice = payload.choices[0];
    const generatedText = choice.message?.content || choice.text || '';
    const responseModel = payload.model || model;
    const finishReason = choice.finish_reason || undefined;

    const usage = payload.usage
      ? {
          promptTokens: payload.usage.prompt_tokens,
          completionTokens: payload.usage.completion_tokens,
          totalTokens: payload.usage.total_tokens,
        }
      : undefined;

    return {
      text: generatedText,
      model: responseModel,
      usage,
      finishReason,
    };
  }
}

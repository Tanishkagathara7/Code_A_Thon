// Active high-performance free models verified on OpenRouter
const BEST_FREE_MODEL = 'nvidia/nemotron-3.5-lightning:free';
const FALLBACK_FREE_MODEL = 'cohere/north-mini-code:free';

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

  private getModels(requestedModel?: string): string[] {
    const envModel = process.env.OPENROUTER_MODEL;
    const primary = (requestedModel && !requestedModel.includes('google/gemini-2.0-flash-lite') && requestedModel !== 'openrouter/free')
      ? requestedModel
      : (envModel && !envModel.includes('google/gemini-2.0-flash-lite') && envModel !== 'openrouter/free')
      ? envModel
      : BEST_FREE_MODEL;

    const list = [primary];
    if (primary !== BEST_FREE_MODEL) list.push(BEST_FREE_MODEL);
    if (!list.includes(FALLBACK_FREE_MODEL)) list.push(FALLBACK_FREE_MODEL);
    return list;
  }

  public async generate(options: AIRequestOptions): Promise<AIResponse> {
    const apiKey = this.getApiKey();
    const baseUrl = this.getBaseUrl();
    const candidateModels = this.getModels(options.model);

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
      const timeoutId = setTimeout(() => controller.abort(), 20000);

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
            throw new AIError('AI provider authentication failed.', 'AUTH_ERROR', 500);
          }
          let errData: any = {};
          try {
            errData = await res.json();
          } catch {
            // ignore
          }
          const message = errData?.error?.message || `Status ${res.status}`;
          console.warn(`⚠️ [AI-GATEWAY] Model "${currentModel}" failed (${res.status}): ${message}. Trying next model...`);
          lastError = new AIError(message, 'PROVIDER_UNAVAILABLE', res.status);
          continue;
        }

        const payload: any = await res.json();
        if (!payload || !Array.isArray(payload.choices) || payload.choices.length === 0) {
          console.warn(`⚠️ [AI-GATEWAY] Model "${currentModel}" returned empty choices. Trying next...`);
          lastError = new AIError('Invalid response from AI model.', 'MALFORMED_RESPONSE', 502);
          continue;
        }

        const choice = payload.choices[0];
        const generatedText = choice.message?.content || choice.text || '';
        if (!generatedText || !generatedText.trim()) {
          console.warn(`⚠️ [AI-GATEWAY] Model "${currentModel}" returned empty text. Trying next...`);
          lastError = new AIError('Empty response from AI model.', 'MALFORMED_RESPONSE', 502);
          continue;
        }

        const responseModel = payload.model || currentModel;
        console.log(`✅ [AI-GATEWAY] AI generation successful using model: ${responseModel}`);

        return {
          text: generatedText.trim(),
          model: responseModel,
          usage: payload.usage
            ? {
                promptTokens: payload.usage.prompt_tokens,
                completionTokens: payload.usage.completion_tokens,
                totalTokens: payload.usage.total_tokens,
              }
            : undefined,
          finishReason: choice.finish_reason || undefined,
        };
      } catch (err: any) {
        clearTimeout(timeoutId);
        if (err instanceof AIError && err.code === 'AUTH_ERROR') {
          throw err;
        }
        console.warn(`⚠️ [AI-GATEWAY] Model "${currentModel}" request error: ${err.message}. Trying next...`);
        lastError = err instanceof AIError ? err : new AIError(err.message || 'AI request failed', 'PROVIDER_UNAVAILABLE', 503);
      }
    }

    throw lastError || new AIError('All configured AI models failed.', 'PROVIDER_UNAVAILABLE', 503);
  }
}

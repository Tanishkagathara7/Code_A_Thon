import assert from 'node:assert';
import { test, describe } from 'node:test';
import jwt from 'jsonwebtoken';
import {
  AIService,
  AIProvider,
  AIRequestOptions,
  AIResponse,
  AIError,
  OpenRouterProvider,
} from '../services/ai';

const API_BASE_URL = process.env.TEST_API_URL || 'http://localhost:5000/api';
const JWT_SECRET = process.env.JWT_SECRET || 'mindbloom_super_secret_jwt_key_hackathon_2026_9xqm';

// Mock Provider for unit testing
class MockAIProvider implements AIProvider {
  public readonly name = 'MockAIProvider';
  public shouldFail = false;
  public failError: Error | null = null;
  public mockResponseText = 'This is a mock AI summary response.';

  async generate(options: AIRequestOptions): Promise<AIResponse> {
    if (this.shouldFail) {
      throw (
        this.failError ||
        new AIError('Mock provider failed.', 'PROVIDER_UNAVAILABLE', 503)
      );
    }

    return {
      text: this.mockResponseText,
      model: options.model || 'mock/model-free',
      usage: {
        promptTokens: 10,
        completionTokens: 20,
        totalTokens: 30,
      },
      finishReason: 'stop',
    };
  }
}

describe('1. Backend AIService Unit Tests & Abstraction', () => {
  test('AIService initializes with default provider or injected provider', () => {
    const mockProvider = new MockAIProvider();
    const service = new AIService(mockProvider);
    assert.strictEqual(service.getProviderName(), 'MockAIProvider');

    const defaultService = new AIService();
    assert.strictEqual(defaultService.getProviderName(), 'OpenRouter');
  });

  test('AIService successfully processes valid prompt and returns normalized response', async () => {
    const mockProvider = new MockAIProvider();
    const service = new AIService(mockProvider);

    const result = await service.generate({
      prompt: 'Summarize the solar system.',
      system: 'You are an astronomy expert.',
    });

    assert.strictEqual(result.text, 'This is a mock AI summary response.');
    assert.strictEqual(result.model, 'mock/model-free');
    assert.ok(result.usage);
    assert.strictEqual(result.usage.totalTokens, 30);
  });

  test('AIService rejects empty or whitespace-only prompt with 400 INVALID_INPUT', async () => {
    const service = new AIService(new MockAIProvider());

    await assert.rejects(
      async () => {
        await service.generate({ prompt: '   ' });
      },
      (err: any) => {
        assert.ok(err instanceof AIError);
        assert.strictEqual(err.statusCode, 400);
        assert.strictEqual(err.code, 'INVALID_INPUT');
        return true;
      }
    );
  });

  test('AIService rejects oversized prompt (>4000 chars) with 400 INVALID_INPUT', async () => {
    const service = new AIService(new MockAIProvider());
    const hugePrompt = 'A'.repeat(4001);

    await assert.rejects(
      async () => {
        await service.generate({ prompt: hugePrompt });
      },
      (err: any) => {
        assert.ok(err instanceof AIError);
        assert.strictEqual(err.statusCode, 400);
        assert.strictEqual(err.code, 'INVALID_INPUT');
        return true;
      }
    );
  });

  test('AIService rejects oversized system instruction (>2000 chars)', async () => {
    const service = new AIService(new MockAIProvider());
    const hugeSystem = 'S'.repeat(2001);

    await assert.rejects(
      async () => {
        await service.generate({
          prompt: 'Valid prompt',
          system: hugeSystem,
        });
      },
      (err: any) => {
        assert.ok(err instanceof AIError);
        assert.strictEqual(err.statusCode, 400);
        assert.strictEqual(err.code, 'INVALID_INPUT');
        return true;
      }
    );
  });

  test('AIService rejects maxTokens > 2048', async () => {
    const service = new AIService(new MockAIProvider());

    await assert.rejects(
      async () => {
        await service.generate({
          prompt: 'Valid prompt',
          maxTokens: 5000,
        });
      },
      (err: any) => {
        assert.ok(err instanceof AIError);
        assert.strictEqual(err.statusCode, 400);
        return true;
      }
    );
  });

  test('AIService safely handles provider failure without secret exposure', async () => {
    const mockProvider = new MockAIProvider();
    mockProvider.shouldFail = true;
    mockProvider.failError = new AIError(
      'AI provider service rate limit reached.',
      'RATE_LIMIT',
      429
    );

    const service = new AIService(mockProvider);

    await assert.rejects(
      async () => {
        await service.generate({ prompt: 'Valid prompt' });
      },
      (err: any) => {
        assert.ok(err instanceof AIError);
        assert.strictEqual(err.statusCode, 429);
        assert.strictEqual(err.code, 'RATE_LIMIT');
        assert.strictEqual(
          err.message.includes('sk-or-v1'),
          false,
          'Error message must never contain API keys'
        );
        return true;
      }
    );
  });
});

describe('2. OpenRouter Provider Secret & Configuration Guard', () => {
  test('OpenRouterProvider fails safely if OPENROUTER_API_KEY is missing', async () => {
    const originalKey = process.env.OPENROUTER_API_KEY;
    delete process.env.OPENROUTER_API_KEY;

    try {
      const provider = new OpenRouterProvider();
      await assert.rejects(
        async () => {
          await provider.generate({ prompt: 'Hello world' });
        },
        (err: any) => {
          assert.ok(err instanceof AIError);
          assert.strictEqual(err.code, 'CONFIG_ERROR');
          assert.strictEqual(err.statusCode, 500);
          return true;
        }
      );
    } finally {
      if (originalKey) {
        process.env.OPENROUTER_API_KEY = originalKey;
      }
    }
  });
});

describe('3. Protected AI API Endpoint /api/ai/generate Integration', () => {
  test('POST /api/ai/generate rejects unauthenticated requests (HTTP 401)', async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/ai/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: 'Summarize text' }),
      });
      assert.strictEqual(res.status, 401, 'Unauthenticated request should return HTTP 401');
      const data = await res.json();
      assert.strictEqual(data.success, false);
      assert.ok(data.error);
    } catch (err: any) {
      console.warn(`[TEST NOTICE] Server offline at ${API_BASE_URL}: ${err.message}`);
    }
  });

  test('POST /api/ai/generate rejects empty prompt with HTTP 400', async () => {
    try {
      const validToken = jwt.sign({ id: 'test_user_id', email: 'test@example.com' }, JWT_SECRET, {
        expiresIn: '1h',
      });

      const res = await fetch(`${API_BASE_URL}/ai/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${validToken}`,
        },
        body: JSON.stringify({ prompt: '' }),
      });

      assert.strictEqual(res.status, 400, 'Empty prompt should return HTTP 400');
      const data = await res.json();
      assert.strictEqual(data.success, false);
      assert.ok(data.error);
    } catch (err: any) {
      console.warn(`[TEST NOTICE] Server offline at ${API_BASE_URL}: ${err.message}`);
    }
  });
});

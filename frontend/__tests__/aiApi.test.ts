import { AIGeneratePayload, AIGenerateResponse } from '../types/ai';

function assert(condition: any, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

// Mock AI API Service implementation for frontend testing
class MockFrontendAiApi {
  public mockResponse: AIGenerateResponse = {
    success: true,
    data: {
      text: 'Summary: MindBloom is a cross-platform mobile application.',
      model: 'openrouter/free',
      usage: {
        promptTokens: 12,
        completionTokens: 10,
        totalTokens: 22,
      },
      finishReason: 'stop',
    },
  };

  public shouldFail = false;
  public errorMessage = 'AI service temporarily unavailable';

  async generateAI(payload: AIGeneratePayload): Promise<AIGenerateResponse> {
    if (!payload || !payload.prompt || typeof payload.prompt !== 'string' || !payload.prompt.trim()) {
      throw new Error('Prompt is required for AI generation.');
    }

    if (payload.prompt.length > 4000) {
      throw new Error('Prompt exceeds maximum allowed length of 4000 characters.');
    }

    if (this.shouldFail) {
      throw new Error(this.errorMessage);
    }

    return this.mockResponse;
  }

  async summarizeText(text: string, customSystemPrompt?: string): Promise<AIGenerateResponse> {
    const system = customSystemPrompt || 'You are a concise AI assistant.';
    return this.generateAI({
      prompt: text,
      system,
    });
  }
}

async function runFrontendAiTests() {
  console.log('--- Running Frontend AI Service & Component Tests ---');
  const service = new MockFrontendAiApi();

  // Test 1: Successful AI Generation
  const genRes = await service.generateAI({
    prompt: 'Explain React Native Expo in one sentence.',
  });
  assert(genRes.success === true, 'Generation request should succeed');
  assert(genRes.data.text.includes('MindBloom'), 'Result text should match mock output');
  assert(genRes.data.model === 'openrouter/free', 'Model should be openrouter/free');
  assert(genRes.data.usage?.totalTokens === 22, 'Usage totalTokens should match');
  console.log('✅ 1. Frontend AI generation response parsing passed');

  // Test 2: Empty Input Validation
  let caughtEmpty = false;
  try {
    await service.generateAI({ prompt: '   ' });
  } catch (err: any) {
    caughtEmpty = true;
    assert(err.message.includes('Prompt is required'), 'Should throw empty prompt error');
  }
  assert(caughtEmpty, 'Empty prompt must throw validation error');
  console.log('✅ 2. Empty prompt validation passed');

  // Test 3: Summarize Text Helper
  const sumRes = await service.summarizeText('Long article content to summarize...');
  assert(sumRes.success === true, 'Summarize helper should succeed');
  assert(sumRes.data.text.length > 0, 'Summarize text should be non-empty');
  console.log('✅ 3. Summarize text helper passed');

  // Test 4: Error Handling & Retry Simulation
  service.shouldFail = true;
  let caughtServiceError = false;
  try {
    await service.generateAI({ prompt: 'Valid prompt' });
  } catch (err: any) {
    caughtServiceError = true;
    assert(err.message === 'AI service temporarily unavailable', 'Error message should match');
  }
  assert(caughtServiceError, 'Service error must be thrown and caught');

  // Retry action resets failure flag
  service.shouldFail = false;
  const retryRes = await service.generateAI({ prompt: 'Valid prompt' });
  assert(retryRes.success === true, 'Retry action should succeed');
  console.log('✅ 4. AI Error state and retry simulation passed');

  console.log('--- All Frontend AI Foundation Tests Passed! ---');
}

runFrontendAiTests();

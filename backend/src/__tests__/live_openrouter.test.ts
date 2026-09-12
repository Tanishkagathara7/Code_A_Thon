import assert from 'node:assert';
import { test, describe } from 'node:test';
import dotenv from 'dotenv';
import path from 'path';

// Load backend environment
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { AIService, OpenRouterProvider, AIError } from '../services/ai';

describe('Live OpenRouter Integration Verification', () => {
  test('Perform real API call to OpenRouter gateway using configured model', async () => {
    const apiKey = process.env.OPENROUTER_API_KEY;
    assert.ok(apiKey, 'OPENROUTER_API_KEY environment variable must be present');
    assert.ok(apiKey.startsWith('sk-or-v1-'), 'API key format valid');

    const provider = new OpenRouterProvider();
    const aiService = new AIService(provider);

    console.log('Sending live prompt to OpenRouter via AIService...');
    const result = await aiService.generate({
      prompt: 'Explain what a mobile application is in one sentence.',
      system: 'You are a helpful, concise assistant.',
    });

    console.log('✅ Live OpenRouter Response Received:');
    console.log('Model used:', result.model);
    console.log('Text generated:', result.text);
    console.log('Usage:', JSON.stringify(result.usage || {}));

    assert.ok(result.text && result.text.trim().length > 0, 'Generated text must be non-empty');
    assert.ok(result.model, 'Model identifier must be returned');
    assert.strictEqual(
      result.text.includes(apiKey),
      false,
      'API key must NEVER appear in returned generated text'
    );
  });
});

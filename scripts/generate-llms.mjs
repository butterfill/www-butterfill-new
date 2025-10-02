import { generateLlmsBundle } from './lib/llms-generator.mjs';

try {
  await generateLlmsBundle();
  console.log('Successfully generated llms bundle');
} catch (error) {
  console.error('Failed to generate llms bundle', error);
  process.exitCode = 1;
}

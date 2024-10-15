import current from '../prompt.js';
import captureOutput from '../captureOutput.js';

describe('prompt', () => {
  it('should return the typed answer', async () => {
    await captureOutput(async () => {
      const actual = current("What is my mother's name?");

      process.stdin.push('Jun');
      process.stdin.push('iper');
      process.stdin.push('\n');

      await expect(actual).resolves.toEqual('Juniper');
    });
  });
  it('should return an empty string if no answer given', async () => {
    await captureOutput(async () => {
      const actual = current("What is my mother's name?");

      process.stdin.push('\n');

      await expect(actual).resolves.toEqual('');
    });
  });
  it('should throw an error on Ctrl-C', async () => {
    await captureOutput(async () => {
      let actual = null;
      try {
        const promptPromise = current("What is my mother's name?");

        process.stdin.push('Jun');
        process.stdin.push('\u0003'); // Ctrl-C

        await promptPromise;
      } catch (err) {
        actual = err;
      }

      expect(actual).toHaveProperty('code', 'ERROR_PROMPT_CTRL_C');
    });
  });
});

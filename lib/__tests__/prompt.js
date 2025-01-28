import { Readable } from 'node:stream';
import current from '../prompt.js';
import captureOutput from '../captureOutput.js';

describe('prompt', () => {
  let mockStdin = null;
  beforeEach(async () => {
    mockStdin = new Readable({ read() {} });
  });
  it('should return the typed answer', async () => {
    await captureOutput(async () => {
      const actual = current("What is my mother's name?", { input: mockStdin });

      mockStdin.push('Jun');
      mockStdin.push('iper');
      mockStdin.push('\n');

      await expect(actual).resolves.toEqual('Juniper');
    });
  });
  it('should return an empty string if no answer given', async () => {
    await captureOutput(async () => {
      const actual = current("What is my mother's name?", { input: mockStdin });

      mockStdin.push('\n');

      await expect(actual).resolves.toEqual('');
    });
  });
  it('should throw an error on Ctrl-C', async () => {
    await captureOutput(async () => {
      let actual = null;
      try {
        const inputPromise = current("What is my mother's name?", {
          input: mockStdin,
        });

        mockStdin.push('Jun');
        mockStdin.push('\u0003'); // Ctrl-C

        await inputPromise;
      } catch (err) {
        actual = err;
      }
      expect(actual).toHaveProperty('code', 'ERROR_PROMPT_CTRL_C');
    });
  });
});

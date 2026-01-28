import { Readable } from 'node:stream';
import { captureOutput } from '../captureOutput.js';
import { prompt } from '../prompt.js';

describe('prompt', () => {
  let mockStdin = null;
  beforeEach(async () => {
    mockStdin = new Readable({ read() {} });
  });
  it('should return the typed answer', async () => {
    await captureOutput(async () => {
      const actual = prompt("What is my mother's name?", { input: mockStdin });

      mockStdin.push('Jun');
      mockStdin.push('iper');
      mockStdin.push('\n');

      await expect(actual).resolves.toEqual('Juniper');
    });
  });
  it('should return an empty string if no answer given', async () => {
    await captureOutput(async () => {
      const actual = prompt("What is my mother's name?", { input: mockStdin });

      mockStdin.push('\n');

      await expect(actual).resolves.toEqual('');
    });
  });
  it('should throw an error on Ctrl-C', async () => {
    await captureOutput(async () => {
      let actual = null;
      try {
        const inputPromise = prompt("What is my mother's name?", {
          input: mockStdin,
        });

        mockStdin.push('Jun');
        mockStdin.push(''); // Ctrl-C

        await inputPromise;
      } catch (err) {
        actual = err;
      }
      expect(actual).toHaveProperty('code', 'FIROST_PROMPT_CTRL_C');
    });
  });
});

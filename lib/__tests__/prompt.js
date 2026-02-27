import { captureOutput } from '../captureOutput.js';
import { prompt } from '../prompt.js';

describe('prompt', () => {
  it('should return the typed answer', async () => {
    mockStdin(async (stdin) => {
      await captureOutput(async () => {
        const actual = prompt("What is my mother's name?");

        stdin.push('Jun');
        stdin.push('iper');
        stdin.push('\n');

        await expect(actual).resolves.toEqual('Juniper');
      });
    });
  });
  it('should return an empty string if no answer given', async () => {
    mockStdin(async (stdin) => {
      await captureOutput(async () => {
        const actual = prompt("What is my mother's name?");

        stdin.push('\n');

        await expect(actual).resolves.toEqual('');
      });
    });
  });
  it('should throw an error on Ctrl-C', async () => {
    mockStdin(async (stdin) => {
      await captureOutput(async () => {
        let actual = null;
        try {
          const inputPromise = prompt("What is my mother's name?");

          stdin.push('Jun');
          stdin.push(''); // Ctrl-C

          await inputPromise;
        } catch (err) {
          actual = err;
        }
        expect(actual).toHaveProperty('code', 'FIROST_PROMPT_CTRL_C');
      });
    });
  });
});

import { captureOutput } from '../captureOutput.js';
import { prompt } from '../prompt.js';

describe('prompt', () => {
  it('should return the typed answer', async () => {
    mockStdin(async (stdin) => {
      await captureOutput(async () => {
        const actual = prompt("What is my mother's name?");

        // inquirer defers its first render by one tick and drops earlier keystrokes
        await new Promise((resolve) => setImmediate(resolve));
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

        // inquirer defers its first render by one tick and drops earlier keystrokes
        await new Promise((resolve) => setImmediate(resolve));
        stdin.push('\n');

        await expect(actual).resolves.toEqual('');
      });
    });
  });
  it('should return the prefilled value when accepted as is', async () => {
    mockStdin(async (stdin) => {
      await captureOutput(async () => {
        const actual = prompt("What is my mother's name?", {
          prefill: 'Juniper',
        });

        // inquirer defers its first render by one tick and drops earlier keystrokes
        await new Promise((resolve) => setImmediate(resolve));
        stdin.push('\n');

        await expect(actual).resolves.toEqual('Juniper');
      });
    });
  });
  it('should let the user edit the prefilled value', async () => {
    mockStdin(async (stdin) => {
      await captureOutput(async () => {
        const actual = prompt("What is my mother's name?", {
          prefill: 'Juniper',
        });

        // inquirer defers its first render by one tick and drops earlier keystrokes
        await new Promise((resolve) => setImmediate(resolve));
        stdin.push(' Berry');
        stdin.push('\n');

        await expect(actual).resolves.toEqual('Juniper Berry');
      });
    });
  });
  it('should ignore an empty prefill', async () => {
    mockStdin(async (stdin) => {
      await captureOutput(async () => {
        const actual = prompt("What is my mother's name?", { prefill: '' });

        // inquirer defers its first render by one tick and drops earlier keystrokes
        await new Promise((resolve) => setImmediate(resolve));
        stdin.push('\n');

        await expect(actual).resolves.toEqual('');
      });
    });
  });
  it('should throw an error on Ctrl-C with a prefill', async () => {
    mockStdin(async (stdin) => {
      await captureOutput(async () => {
        let actual = null;
        try {
          const inputPromise = prompt("What is my mother's name?", {
            prefill: 'Juniper',
          });

          stdin.push(''); // Ctrl-C

          await inputPromise;
        } catch (err) {
          actual = err;
        }
        expect(actual).toHaveProperty('code', 'FIROST_PROMPT_CTRL_C');
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

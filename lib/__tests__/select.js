import { captureOutput } from '../captureOutput.js';
import { select } from '../select.js';

describe('select', () => {
  describe('string[] choices', () => {
    it('should return the selected value', async () => {
      mockStdin(async (stdin) => {
        await captureOutput(async () => {
          const actual = select('Pick a color', ['red', 'green', 'blue']);

          // Simulate down arrow and enter
          stdin.push('\n');

          await expect(actual).resolves.toEqual('red');
        });
      });
    });
  });
  describe('{label, value}[] choices', () => {
    it('should return the selected value', async () => {
      mockStdin(async (stdin) => {
        await captureOutput(async () => {
          const actual = select('Pick a size', [
            { name: 'Small (S)', value: 's' },
            { name: 'Medium (M)', value: 'm' },
            { name: 'Large (L)', value: 'l' },
          ]);

          stdin.push('\n');

          await expect(actual).resolves.toEqual('s');
        });
      });
    });
  });
  describe('Ctrl-C', () => {
    it('should throw an error on Ctrl-C', async () => {
      mockStdin(async (stdin) => {
        await captureOutput(async () => {
          let actual = null;
          try {
            const selectPromise = select('Pick a color', ['red', 'green']);

            stdin.push(''); // Ctrl-C

            await selectPromise;
          } catch (err) {
            actual = err;
          }
          expect(actual).toHaveProperty('code', 'FIROST_SELECT_CTRL_C');
        });
      });
    });
  });
});

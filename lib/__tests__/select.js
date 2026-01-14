import { Readable } from 'node:stream';
import { select } from '../select.js';
import { captureOutput } from '../captureOutput.js';

describe('select', () => {
  let mockStdin = null;
  beforeEach(async () => {
    mockStdin = new Readable({ read() {} });
  });
  describe('string[] choices', () => {
    it('should return the selected value', async () => {
      await captureOutput(async () => {
        const actual = select('Pick a color', ['red', 'green', 'blue'], {
          input: mockStdin,
        });

        // Simulate down arrow and enter
        mockStdin.push('\n');

        await expect(actual).resolves.toEqual('red');
      });
    });
  });
  describe('{label, value}[] choices', () => {
    it('should return the selected value', async () => {
      await captureOutput(async () => {
        const actual = select(
          'Pick a size',
          [
            { name: 'Small (S)', value: 's' },
            { name: 'Medium (M)', value: 'm' },
            { name: 'Large (L)', value: 'l' },
          ],
          { input: mockStdin },
        );

        mockStdin.push('\n');

        await expect(actual).resolves.toEqual('s');
      });
    });
  });
  describe('Ctrl-C', () => {
    it('should throw an error on Ctrl-C', async () => {
      await captureOutput(async () => {
        let actual = null;
        try {
          const selectPromise = select('Pick a color', ['red', 'green'], {
            input: mockStdin,
          });

          mockStdin.push(''); // Ctrl-C

          await selectPromise;
        } catch (err) {
          actual = err;
        }
        expect(actual).toHaveProperty('code', 'FIROST_SELECT_CTRL_C');
      });
    });
  });
});

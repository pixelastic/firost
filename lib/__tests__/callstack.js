import { absolute } from '../absolute.js';
import { callstack as current } from '../callstack.js';
import { emptyDir } from '../emptyDir.js';
import { here } from '../here.js';
import { firostRoot } from '../test-helpers/firostRoot.js';

describe('callstack', () => {
  const tmpDir = absolute(firostRoot, '/tmp/callstack');
  beforeEach(async () => {
    await emptyDir(tmpDir);
  });
  describe('no argument, full callstack', () => {
    it('should have the current file as the first element', async () => {
      const actual = current();

      expect(actual[0]).toHaveProperty('filepath', here());
    });
    it('should find the right function name', async function myCustomFunction() {
      const actual = current();

      expect(actual[0]).toHaveProperty('function', 'myCustomFunction');
    });
  });
  describe('with a depth argument', () => {
    it('0 is the calling file', async () => {
      const actual = current(0);

      expect(actual).toHaveProperty('filepath', here());
    });
    it('1 is not the calling file', async () => {
      const actual = current(1);

      expect(actual).toHaveProperty(
        'filepath',
        expect.not.stringMatching(here()),
      );
    });
    it('should return full path to node_modules file', async () => {
      const actual = current(1);

      expect(actual).toHaveProperty(
        'filepath',
        expect.stringMatching(/(.*)\/node_modules\/(.*)\.js$/),
      );
    });
  });
});

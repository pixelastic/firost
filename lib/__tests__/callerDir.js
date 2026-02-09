import path from 'node:path';
import { absolute } from '../absolute.js';
import { callerDir } from '../callerDir.js';
import { emptyDir } from '../emptyDir.js';
import { firostRoot } from '../test-helpers/firostRoot.js';

describe('callerDir', () => {
  const tmpDir = absolute(firostRoot, '/tmp/callerDir');
  beforeEach(async () => {
    await emptyDir(tmpDir);
  });
  it('should return the directory of the parent caller', async () => {
    // callerDir() returns the directory of the parent of the file that called it
    // So we need a helper function
    /**
     *
     */
    function helperFunction() {
      return callerDir();
    }

    const expected = path.resolve(firostRoot, './lib/__tests__');
    const actual = helperFunction();
    expect(actual).toEqual(expected);
  });
});

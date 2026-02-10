import path from 'node:path';
import { callerDir } from '../callerDir.js';
import { firostRoot } from '../test-helpers/firostRoot.js';

describe('callerDir', () => {
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

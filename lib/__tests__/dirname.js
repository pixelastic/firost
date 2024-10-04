import path from 'path';
import absolute from '../absolute.js';
import current from '../dirname.js';
import emptyDir from '../emptyDir.js';
import gitRoot from '../gitRoot/index.js';
import exists from '../exists.js';

describe('dirname', () => {
  const tmpDir = absolute('<gitRoot>/tmp/dirname');
  beforeEach(async () => {
    await emptyDir(tmpDir);
  });
  it('should return directory of this test', async () => {
    const expected = path.resolve(gitRoot(), './lib/__tests__');
    const actual = current();
    expect(actual).toEqual(expected);

    // We'll also check that the directory contains this file
    const hasThisFile = await exists(path.resolve(actual, './dirname.js'));
    expect(hasThisFile).toBe(true);
  });
});

import path from 'node:path';
import { absolute } from '../absolute.js';
import { here } from '../here.js';
import { emptyDir } from '../emptyDir.js';
import { read } from '../read.js';
import { firostRoot } from '../test-helpers/firostRoot.js';

describe('here', () => {
  const tmpDir = absolute(firostRoot, '/tmp/here');
  beforeEach(async () => {
    await emptyDir(tmpDir);
  });
  it('should return the path to this test file', async () => {
    const expected = path.resolve(firostRoot, './lib/__tests__/here.js');
    const actual = here();
    expect(actual).toEqual(expected);

    // We'll also read the file, to make sure it contains the following magic
    // comment:
    // firost-magic-comment-here-test
    const fileContent = await read(actual);
    expect(fileContent).toContain('firost-magic-comment-here-test');
  });
});

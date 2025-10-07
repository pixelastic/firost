import { absolute } from '../absolute.js';
import { write } from '../write.js';
import { read } from '../read.js';
import { emptyDir } from '../emptyDir.js';
import { exists } from '../exists.js';
import { firostRoot } from '../test-helpers/firostRoot.js';

describe('write', () => {
  const tmpDir = absolute(firostRoot, '/tmp/write');
  beforeEach(async () => {
    await emptyDir(tmpDir);
  });
  it('should create a file with the given content', async () => {
    await write('content', `${tmpDir}/file.txt`);

    expect(await read(`${tmpDir}/file.txt`)).toBe('content');
  });
  it('should overwrite an existing file', async () => {
    await write('initial content', `${tmpDir}/file.txt`);
    await write('updated content', `${tmpDir}/file.txt`);

    expect(await read(`${tmpDir}/file.txt`)).toBe('updated content');
  });
  it('should create nested directories', async () => {
    await write('content', `${tmpDir}/nested/sub/directories/file.txt`);

    expect(await read(`${tmpDir}/nested/sub/directories/file.txt`)).toBe(
      'content',
    );
  });
  it('should do nothing if given undefined as content', async () => {
    await write(undefined, `${tmpDir}/file.txt`);

    expect(await exists(`${tmpDir}/file.txt`)).toBe(false);
  });
  it('should warn if ENAMETOOLONG (probably swapped args)', async () => {
    const dummyContent = 'a'.repeat(5000);

    let actual = null;
    try {
      await write(`${tmpDir}/file.txt`, dummyContent);
    } catch (error) {
      actual = error;
    }

    expect(actual).toHaveProperty('code', 'ERROR_SWAPPED_ARGUMENTS');
  });
});

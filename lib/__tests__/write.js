import current from '../write.js';
import read from '../read.js';
import emptyDir from '../emptyDir.js';
import exists from '../exists.js';

describe('write', () => {
  const tmpDir = './tmp/write';
  beforeEach(async () => {
    await emptyDir(tmpDir);
  });
  it('should create a file with the given content', async () => {
    await current('content', `${tmpDir}/file.txt`);

    expect(await read(`${tmpDir}/file.txt`)).toBe('content');
  });
  it('should overwrite an existing file', async () => {
    await current('initial content', `${tmpDir}/file.txt`);
    await current('updated content', `${tmpDir}/file.txt`);

    expect(await read(`${tmpDir}/file.txt`)).toBe('updated content');
  });
  it('should create nested directories', async () => {
    await current('content', `${tmpDir}/nested/sub/directories/file.txt`);

    expect(await read(`${tmpDir}/nested/sub/directories/file.txt`)).toBe(
      'content',
    );
  });
  it('should do nothing if given undefined as content', async () => {
    await current(undefined, `${tmpDir}/file.txt`);

    expect(await exists(`${tmpDir}/file.txt`)).toBe(false);
  });
});

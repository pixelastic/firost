import { absolute } from '../absolute.js';
import { exists } from '../exists.js';
import { read } from '../read.js';
import { remove } from '../remove.js';
import { runInUserland } from '../test-helpers/runInUserland.js';
import { tmpDirectory } from '../tmpDirectory.js';
import { write } from '../write.js';

describe('write', () => {
  const testDirectory = tmpDirectory(`firost/${describeName}`);
  afterEach(async () => {
    await remove(testDirectory);
  });
  it('should create a file with the given content', async () => {
    await write('content', `${testDirectory}/file.txt`);

    expect(await read(`${testDirectory}/file.txt`)).toBe('content');
  });
  it('should overwrite an existing file', async () => {
    await write('initial content', `${testDirectory}/file.txt`);
    await write('updated content', `${testDirectory}/file.txt`);

    expect(await read(`${testDirectory}/file.txt`)).toBe('updated content');
  });
  it('should create nested directories', async () => {
    await write('content', `${testDirectory}/nested/sub/directories/file.txt`);

    expect(await read(`${testDirectory}/nested/sub/directories/file.txt`)).toBe(
      'content',
    );
  });
  it('should do nothing if given undefined as content', async () => {
    await write(undefined, `${testDirectory}/file.txt`);

    expect(await exists(`${testDirectory}/file.txt`)).toBe(false);
  });
  it('should warn if ENAMETOOLONG (probably swapped args)', async () => {
    const dummyContent = 'a'.repeat(5000);

    let actual = null;
    try {
      await write(`${testDirectory}/file.txt`, dummyContent);
    } catch (error) {
      actual = error;
    }

    expect(actual).toHaveProperty('code', 'FIROST_WRITE_SWAPPED_ARGUMENTS');
  });
  it('with relative paths', async () => {
    await runInUserland(
      dedent`
        const { write } = await __import('./write.js');
        return await write('something', './file.txt');
      `,
      absolute(testDirectory, 'lib/app.js'),
    );

    const actual = await read(`${testDirectory}/lib/file.txt`);
    expect(actual).toEqual('something');
  });
});

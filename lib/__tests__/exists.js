import { absolute } from '../absolute.js';
import { exists } from '../exists.js';
import { mkdirp } from '../mkdirp.js';
import { remove } from '../remove.js';
import { runInUserland } from '../test-helpers/runInUserland.js';
import { tmpDirectory } from '../tmpDirectory.js';
import { write } from '../write.js';

describe('exists', () => {
  const testDirectory = tmpDirectory('firost/exists');
  afterEach(async () => {
    await remove(testDirectory);
  });
  it('should return true if the target is a file', async () => {
    await write('something', `${testDirectory}/foo.txt`);

    const actual = await exists(`${testDirectory}/foo.txt`);

    expect(actual).toBe(true);
  });
  it('should return true if the target is a directory', async () => {
    await mkdirp(`${testDirectory}/folder`);

    const actual = await exists(`${testDirectory}/folder`);

    expect(actual).toBe(true);
  });
  it('should return false if the target does not exist', async () => {
    const actual = await exists(`${testDirectory}/nope`);

    expect(actual).toBe(false);
  });
  describe('empty files', () => {
    it('should return true by default', async () => {
      await write('', `${testDirectory}/empty.txt`);

      const actual = await exists(`${testDirectory}/empty.txt`);

      expect(actual).toBe(true);
    });
    it('should return false with ignoreEmptyFiles: true', async () => {
      await write('', `${testDirectory}/empty.txt`);

      const actual = await exists(`${testDirectory}/empty.txt`, {
        ignoreEmptyFiles: true,
      });

      expect(actual).toBe(false);
    });
  });
  it('with relative paths', async () => {
    await write('something', `${testDirectory}/lib/file.txt`);

    const actual = await runInUserland(
      dedent`
        const { exists } = await __import('./exists.js');
        return await exists('./file.txt');
      `,
      absolute(testDirectory, 'lib/app.js'),
    );

    expect(actual).toBe(true);
  });
});

import { absolute } from '../absolute.js';
import { exists } from '../exists.js';
import { mkdirp } from '../mkdirp.js';
import { write } from '../write.js';
import { emptyDir } from '../emptyDir.js';
import { firostRoot } from '../test-helpers/firostRoot.js';

describe('exists', () => {
  const tmpDir = absolute(firostRoot, '/tmp/exists');
  beforeEach(async () => {
    await emptyDir(tmpDir);
  });
  it('should return true if the target is a file', async () => {
    await write('foo', `${tmpDir}/foo.txt`);

    const actual = await exists(`${tmpDir}/foo.txt`);

    expect(actual).toBe(true);
  });
  it('should return true if the target is a directory', async () => {
    await mkdirp(`${tmpDir}/folder`);

    const actual = await exists(`${tmpDir}/folder`);

    expect(actual).toBe(true);
  });
  it('should return false if the target does not exist', async () => {
    const actual = await exists(`${tmpDir}/nope`);

    expect(actual).toBe(false);
  });
  it('should understand <placeholders>', async () => {
    await write('foo', `${tmpDir}/foo.txt`);

    const actual = await exists('<gitRoot>/tmp/exists/foo.txt');

    expect(actual).toBe(true);
  });
  describe('empty files', () => {
    it('should return true by default', async () => {
      await write('', `${tmpDir}/empty.txt`);

      const actual = await exists(`${tmpDir}/empty.txt`);

      expect(actual).toBe(true);
    });
    it('should return false with ignoreEmptyFiles: true', async () => {
      await write('', `${tmpDir}/empty.txt`);

      const actual = await exists(`${tmpDir}/empty.txt`, {
        ignoreEmptyFiles: true,
      });

      expect(actual).toBe(false);
    });
  });
});

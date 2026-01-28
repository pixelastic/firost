import { absolute } from '../absolute.js';
import { emptyDir } from '../emptyDir.js';
import { isFile } from '../isFile.js';
import { mkdirp } from '../mkdirp.js';
import { newFile } from '../newFile/index.js';
import { remove } from '../remove.js';
import { symlink } from '../symlink.js';
import { firostRoot } from '../test-helpers/firostRoot.js';
import { runInUserland } from '../test-helpers/runInUserland.js';
import { tmpDirectory } from '../tmpDirectory.js';
import { write } from '../write.js';

describe('isFile', () => {
  const tmpDir = absolute(firostRoot, '/tmp/isFile');
  beforeEach(async () => {
    await emptyDir(tmpDir);
  });
  it('should return true if target is a file', async () => {
    await write('foo', `${tmpDir}/file.txt`);
    const actual = await isFile(`${tmpDir}/file.txt`);

    expect(actual).toBe(true);
  });
  it('should return false if target is a directory', async () => {
    await mkdirp(`${tmpDir}/file`);
    const actual = await isFile(`${tmpDir}/file`);

    expect(actual).toBe(false);
  });
  it('should return false if target does not exist', async () => {
    const actual = await isFile(`${tmpDir}/nope.nope`);

    expect(actual).toBe(false);
  });
  it('with <placeholders>', async () => {
    // Given
    const userlandTmpDir = tmpDirectory('firost/isFile');
    await mkdirp(absolute(userlandTmpDir, '.git'));
    await newFile(absolute(userlandTmpDir, 'lib/src/file.txt'));

    // When
    const actual = await runInUserland(
      dedent`
          const { isFile } = await __import('./isFile.js');
          const one = await isFile('<gitRoot>/lib/src/file.txt');
          const two = await isFile('<gitRoot>/lib/');
          const three = await isFile('<gitRoot>/lib/nope.txt');
          return { one, two, three }
        `,
      absolute(userlandTmpDir, 'lib/app.js'),
    );

    // Then
    expect(actual).toEqual({
      one: true,
      two: false,
      three: false,
    });

    // Cleanup
    await remove(userlandTmpDir);
  });
  it('should return true if target is a symlink to a file', async () => {
    const filePath = `${tmpDir}/foo.txt`;
    const linkPath = `${tmpDir}/link.txt`;
    await write('file content', filePath);
    await symlink(linkPath, './foo.txt');

    const actual = await isFile(linkPath);

    expect(actual).toBe(true);
  });
});

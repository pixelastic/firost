import { absolute } from '../absolute.js';
import { emptyDir } from '../emptyDir.js';
import { mkdirp } from '../mkdirp.js';
import { readJson } from '../readJson.js';
import { remove } from '../remove.js';
import { firostRoot } from '../test-helpers/firostRoot.js';
import { runInUserland } from '../test-helpers/runInUserland.js';
import { tmpDirectory } from '../tmpDirectory.js';
import { write } from '../write.js';
import { writeJson } from '../writeJson.js';

describe('readJson', () => {
  const tmpDir = absolute(firostRoot, '/tmp/readJson');
  beforeEach(async () => {
    await emptyDir(tmpDir);
  });
  it('should return the content of a file as a JSON object', async () => {
    await writeJson({ foo: 'bar' }, `${tmpDir}/foo.json`);

    const actual = await readJson(`${tmpDir}/foo.json`);

    expect(actual).toHaveProperty('foo', 'bar');
  });
  it('should reject if reading a non-existing file', async () => {
    let actual;
    try {
      await readJson(`${tmpDir}/nope.json`);
    } catch (err) {
      actual = err;
    }
    expect(actual).toHaveProperty('code', 'ENOENT');
  });
  it('should reject if reading a directory', async () => {
    await mkdirp(`${tmpDir}/folder`);

    let actual;
    try {
      await readJson(`${tmpDir}/folder`);
    } catch (err) {
      actual = err;
    }
    expect(actual).toHaveProperty('code', 'EISDIR');
  });
  it('should reject if not a JSON file', async () => {
    await write('foo', `${tmpDir}/foo.txt`);

    let actual;
    try {
      await readJson(`${tmpDir}/foo.txt`);
    } catch (err) {
      actual = err;
    }
    expect(actual).toHaveProperty('code', 'FIROST_READ_JSON_NOT_JSON');
  });
  it('with <placeholders>', async () => {
    // Given
    const userlandTmpDir = tmpDirectory('firost/readJson');
    await mkdirp(absolute(userlandTmpDir, '.git'));
    await writeJson(
      { value: 'something' },
      absolute(userlandTmpDir, 'lib/src/file.json'),
    );

    // When
    const actual = await runInUserland(
      dedent`
          const { readJson } = await __import('./readJson.js');
          return await readJson('<gitRoot>/lib/src/file.json');
        `,
      absolute(userlandTmpDir, 'lib/app.js'),
    );

    // Then
    expect(actual).toHaveProperty('value', 'something');

    // Cleanup
    await remove(userlandTmpDir);
  });
});

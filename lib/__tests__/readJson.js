import { absolute } from '../absolute.js';
import { readJson } from '../readJson.js';
import { writeJson } from '../writeJson.js';
import { write } from '../write.js';
import { mkdirp } from '../mkdirp.js';
import { emptyDir } from '../emptyDir.js';
import { firostRoot } from '../test-helpers/firostRoot.js';

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
    expect(actual).toHaveProperty('code', 'ERROR_NOT_JSON');
  });
  it('should understand <placeholders>', async () => {
    await writeJson({ foo: 'bar' }, `${tmpDir}/test.json`);

    const actual = await readJson('<gitRoot>/tmp/readJson/test.json');

    expect(actual).toHaveProperty('foo', 'bar');
  });
});

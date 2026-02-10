import { mkdirp } from '../mkdirp.js';
import { readJson } from '../readJson.js';
import { remove } from '../remove.js';
import { tmpDirectory } from '../tmpDirectory.js';
import { write } from '../write.js';
import { writeJson } from '../writeJson.js';

describe('readJson', () => {
  const testDirectory = tmpDirectory(`firost/${describeName}`);
  afterEach(async () => {
    await remove(testDirectory);
  });
  it('should return the content of a file as a JSON object', async () => {
    await writeJson({ foo: 'bar' }, `${testDirectory}/foo.json`);

    const actual = await readJson(`${testDirectory}/foo.json`);

    expect(actual).toHaveProperty('foo', 'bar');
  });
  it('should reject if reading a non-existing file', async () => {
    let actual;
    try {
      await readJson(`${testDirectory}/nope.json`);
    } catch (err) {
      actual = err;
    }
    expect(actual).toHaveProperty('code', 'ENOENT');
  });
  it('should reject if reading a directory', async () => {
    await mkdirp(`${testDirectory}/folder`);

    let actual;
    try {
      await readJson(`${testDirectory}/folder`);
    } catch (err) {
      actual = err;
    }
    expect(actual).toHaveProperty('code', 'EISDIR');
  });
  it('should reject if not a JSON file', async () => {
    await write('foo', `${testDirectory}/foo.txt`);

    let actual;
    try {
      await readJson(`${testDirectory}/foo.txt`);
    } catch (err) {
      actual = err;
    }
    expect(actual).toHaveProperty('code', 'FIROST_READ_JSON_NOT_JSON');
  });
});

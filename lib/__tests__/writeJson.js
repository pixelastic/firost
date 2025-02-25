import { absolute } from '../absolute.js';
import { __, writeJson } from '../writeJson.js';
import { readJson } from '../readJson.js';
import { read } from '../read.js';
import { emptyDir } from '../emptyDir.js';
import { exists } from '../exists.js';
import { firostRoot } from '../test-helpers/firostRoot.js';

describe('writeJson', () => {
  const tmpDir = absolute(firostRoot, '/tmp/writeJson');
  beforeEach(async () => {
    await emptyDir(tmpDir);
  });
  it('should create a file with the given content', async () => {
    const filepath = `${tmpDir}/name.json`;
    await writeJson({ name: 'Geralt' }, filepath);

    const actual = await readJson(filepath);

    expect(actual).toHaveProperty('name', 'Geralt');
  });
  it('should overwrite an existing file', async () => {
    const filepath = `${tmpDir}/name.json`;
    await writeJson({ name: 'Geralt' }, filepath);
    await writeJson({ name: 'Yennefer' }, filepath);

    const actual = await readJson(filepath);

    expect(actual).toHaveProperty('name', 'Yennefer');
  });
  it('should create nested directories', async () => {
    const filepath = `${tmpDir}/one/two/name.json`;
    await writeJson({ name: 'Geralt' }, filepath);

    const actual = await readJson(filepath);

    expect(actual).toHaveProperty('name', 'Geralt');
  });
  it('should do nothing if given undefined as content', async () => {
    const filepath = `${tmpDir}/one/two/name.json`;
    await writeJson(undefined, filepath);

    expect(await exists(filepath)).toBe(false);
  });
  describe('sorting', () => {
    it('should sort the object keys by default', async () => {
      const filepath = `${tmpDir}/file.json`;
      await writeJson({ zoom: true, name: 'Geralt' }, filepath);

      const actual = await read(filepath);
      expect(actual).toEqual(dedent`
      {
        "name": "Geralt",
        "zoom": true
      }
      `);
    });
    it('should not sort the object keys with { sort: false }', async () => {
      const filepath = `${tmpDir}/file.json`;
      await writeJson({ zoom: true, name: 'Geralt' }, filepath, {
        sort: false,
      });

      const actual = await read(filepath);
      expect(actual).toEqual(dedent`
      {
        "zoom": true,
        "name": "Geralt"
      }
      `);
    });
  });
  describe('pretty print', () => {
    it('should pretty print the output', async () => {
      vi.spyOn(__, 'getPrettier').mockReturnValue(null);

      const filepath = `${tmpDir}/file.json`;
      await writeJson({ name: 'Geralt', numbers: [1, 2, 3] }, filepath);

      const actual = await read(filepath);
      expect(actual).toEqual(dedent`
      {
        "name": "Geralt",
        "numbers": [
          1,
          2,
          3
        ]
      }
      `);
    });
    it('should use prettier if available', async () => {
      const filepath = `${tmpDir}/file.json`;
      await writeJson({ name: 'Geralt', numbers: [1, 2, 3] }, filepath);

      const actual = await read(filepath);
      expect(actual).toEqual(dedent`
      {
        "name": "Geralt",
        "numbers": [1, 2, 3]
      }
      `);
    });
  });
});

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

  it('should throw error when arguments are swapped', async () => {
    const filepath = `${tmpDir}/file.json`;
    const data = { name: 'Geralt' };

    let actual = null;
    try {
      await writeJson(filepath, data);
    } catch (err) {
      actual = err;
    }

    expect(actual).toHaveProperty('code', 'ERROR_WRITEJSON_SWAPPED_ARGUMENTS');
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

    it('should order keys according to array when sort is an array', async () => {
      const filepath = `${tmpDir}/file.json`;
      const data = {
        banana: 'yellow',
        name: 'Geralt',
        age: 100,
        apple: 'fruit',
        profession: 'Witcher',
        zoom: true,
      };
      const keyOrder = ['zoom', 'profession', 'name'];

      await writeJson(data, filepath, { sort: keyOrder });

      const actual = await read(filepath);
      expect(actual).toEqual(dedent`
      {
        "zoom": true,
        "profession": "Witcher",
        "name": "Geralt",
        "age": 100,
        "apple": "fruit",
        "banana": "yellow"
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
  it('should understand <placeholders>', async () => {
    await writeJson({ foo: 'bar' }, '<gitRoot>/tmp/writeJson/test.json');

    const actual = await readJson(`${tmpDir}/test.json`);

    expect(actual).toHaveProperty('foo', 'bar');
  });
});

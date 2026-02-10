import { cache } from 'firost';
import { glob } from '../glob.js';
import { readJson } from '../readJson.js';
import { readJsonUrl } from '../readJsonUrl.js';
import { remove } from '../remove.js';
import { closeServer, startServer } from '../test-helpers/server.js';
import { tmpDirectory } from '../tmpDirectory.js';
import { write } from '../write.js';
import { writeJson } from '../writeJson.js';

describe('readJsonUrl', () => {
  const testDirectory = tmpDirectory(`firost/${describeName}`);
  const cacheDirectory = `${testDirectory}/cache`;
  const serverDirectory = `${testDirectory}/server`;

  let serverUrl;
  beforeAll(async () => {
    serverUrl = await startServer(serverDirectory);
  });
  beforeEach(async () => {
    cache.clearAll();
  });
  afterEach(async () => {
    await remove(testDirectory);
  });
  afterAll(async () => {
    closeServer();
  });

  it('should reject if no such file exists', async () => {
    let actual;
    try {
      await readJsonUrl(`${serverUrl}/nope.json`);
    } catch (err) {
      actual = err;
    }
    expect(actual).toHaveProperty('code', 'HTTP_ERROR_404');
  });
  it('should reject if the file is not JSON', async () => {
    await write('text file', `${serverDirectory}/root.txt`);
    let actual;
    try {
      await readJsonUrl(`${serverUrl}/root.txt`);
    } catch (err) {
      actual = err;
    }
    expect(actual).toHaveProperty('code', 'FIROST_READ_JSON_URL_NOT_JSON');
  });
  it('should return the parsed JSON', async () => {
    await writeJson({ foo: 'bar' }, `${serverDirectory}/file.json`);
    const actual = await readJsonUrl(`${serverUrl}/file.json`);

    expect(actual).toHaveProperty('foo', 'bar');
  });
  describe('memoryCache', () => {
    it('should read subsequent calls from cache by default', async () => {
      await writeJson({ foo: 'bar' }, `${serverDirectory}/file.json`);
      const firstRead = await readJsonUrl(`${serverUrl}/file.json`);
      await writeJson({ foo: 'baz' }, `${serverDirectory}/file.json`);
      const secondRead = await readJsonUrl(`${serverUrl}/file.json`);

      expect(firstRead).toHaveProperty('foo', 'bar');
      expect(secondRead).toHaveProperty('foo', 'bar');
    });
    it('should force read from source if cache is disabled', async () => {
      await writeJson({ foo: 'bar' }, `${serverDirectory}/file.json`);
      const firstRead = await readJsonUrl(`${serverUrl}/file.json`, {
        memoryCache: false,
      });
      await writeJson({ foo: 'baz' }, `${serverDirectory}/file.json`);
      const secondRead = await readJsonUrl(`${serverUrl}/file.json`, {
        memoryCache: false,
      });

      expect(firstRead).toHaveProperty('foo', 'bar');
      expect(secondRead).toHaveProperty('foo', 'baz');
    });
  });
  describe('diskCache', () => {
    it('should write file in disk cache if enabled', async () => {
      await writeJson({ foo: 'bar' }, `${serverDirectory}/file.json`);
      await readJsonUrl(`${serverUrl}/file.json`, {
        memoryCache: false,
        diskCache: cacheDirectory,
      });

      const actual = (await glob(`${cacheDirectory}/**/file.json`))[0];
      expect(await readJson(actual)).toHaveProperty('foo', 'bar');
    });
    it('should read file from disk if enabled', async () => {
      await writeJson({ foo: 'bar' }, `${serverDirectory}/file.json`);
      await readJsonUrl(`${serverUrl}/file.json`, {
        memoryCache: false,
        diskCache: cacheDirectory,
      });

      const cacheFile = (await glob(`${cacheDirectory}/**/file.json`))[0];
      await writeJson({ foo: 'baz' }, cacheFile);

      const actual = await readJsonUrl(`${serverUrl}/file.json`, {
        memoryCache: false,
        diskCache: cacheDirectory,
      });

      expect(actual).toHaveProperty('foo', 'baz');
    });
  });
});

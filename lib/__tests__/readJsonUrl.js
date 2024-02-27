import current from '../readJsonUrl.js';
import serverHelper from '../test-helpers/server.js';
import emptyDir from '../emptyDir.js';
import write from '../write.js';
import readJson from '../readJson.js';
import glob from '../glob.js';
import writeJson from '../writeJson.js';

describe('readJsonUrl', () => {
  const serverDir = './tmp/readJsonUrl/server';
  const cacheDir = './tmp/readJsonUrl/cache';
  let serverUrl;
  let serverStarted = false;
  beforeEach(async () => {
    await emptyDir(serverDir);
    await emptyDir(cacheDir);

    if (!serverStarted) {
      serverStarted = true;
      serverUrl = await serverHelper.start(serverDir);
      return;
    }
  });
  afterAll(() => {
    serverHelper.close();
  });
  it('should reject if no such file exists', async () => {
    let actual;
    try {
      await current(`${serverUrl}/nope.json`);
    } catch (err) {
      actual = err;
    }
    expect(actual).toHaveProperty('code', 'HTTP_ERROR_404');
  });
  it('should reject if the file is not JSON', async () => {
    await write('text file', `${serverDir}/root.txt`);
    let actual;
    try {
      await current(`${serverUrl}/root.txt`);
    } catch (err) {
      actual = err;
    }
    expect(actual).toHaveProperty('code', 'ERROR_NOT_JSON');
  });
  it('should return the parsed JSON', async () => {
    await writeJson({ foo: 'bar' }, `${serverDir}/file.json`);
    const actual = await current(`${serverUrl}/file.json`);

    expect(actual).toHaveProperty('foo', 'bar');
  });
  describe('memoryCache', () => {
    it('should read subsequent calls from cache by default', async () => {
      await writeJson({ foo: 'bar' }, `${serverDir}/file.json`);
      const firstRead = await current(`${serverUrl}/file.json`);
      await writeJson({ foo: 'baz' }, `${serverDir}/file.json`);
      const secondRead = await current(`${serverUrl}/file.json`);

      expect(firstRead).toHaveProperty('foo', 'bar');
      expect(secondRead).toHaveProperty('foo', 'bar');
    });
    it('should force read from source if cache is disabled', async () => {
      await writeJson({ foo: 'bar' }, `${serverDir}/file.json`);
      const firstRead = await current(`${serverUrl}/file.json`, {
        memoryCache: false,
      });
      await writeJson({ foo: 'baz' }, `${serverDir}/file.json`);
      const secondRead = await current(`${serverUrl}/file.json`, {
        memoryCache: false,
      });

      expect(firstRead).toHaveProperty('foo', 'bar');
      expect(secondRead).toHaveProperty('foo', 'baz');
    });
  });
  describe('diskCache', () => {
    it('should write file in disk cache if enabled', async () => {
      await writeJson({ foo: 'bar' }, `${serverDir}/file.json`);
      await current(`${serverUrl}/file.json`, {
        memoryCache: false,
        diskCache: cacheDir,
      });

      const actual = (await glob(`${cacheDir}/**/file.json`))[0];
      expect(await readJson(actual)).toHaveProperty('foo', 'bar');
    });
    it('should read file from disk if enabled', async () => {
      await writeJson({ foo: 'bar' }, `${serverDir}/file.json`);
      await current(`${serverUrl}/file.json`, {
        memoryCache: false,
        diskCache: cacheDir,
      });

      const cacheFile = (await glob(`${cacheDir}/**/file.json`))[0];
      await writeJson({ foo: 'baz' }, cacheFile);

      const actual = await current(`${serverUrl}/file.json`, {
        memoryCache: false,
        diskCache: cacheDir,
      });

      expect(actual).toHaveProperty('foo', 'baz');
    });
  });
});

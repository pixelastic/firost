import current from '../readUrl.js';
import serverHelper from '../test-helpers/server.js';
import emptyDir from '../emptyDir.js';
import read from '../read.js';
import write from '../write.js';
import glob from '../glob.js';
import cache from '../cache.js';

describe('readUrl', () => {
  const serverDir = './tmp/readUrl/server';
  const cacheDir = './tmp/readUrl/cache';
  let serverUrl;
  let serverStarted = false;
  beforeEach(async () => {
    cache.clearAll();
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
      await current(`${serverUrl}/nope.html`);
    } catch (err) {
      actual = err;
    }
    expect(actual).toHaveProperty('code', 'HTTP_ERROR_404');
  });
  describe('memoryCache', () => {
    it('should read subsequent calls from cache by default', async () => {
      await write('some content', `${serverDir}/index.html`);
      const firstRead = await current(`${serverUrl}/index.html`);
      await write('updated content', `${serverDir}/index.html`);
      const secondRead = await current(`${serverUrl}/index.html`);

      expect(firstRead).toBe('some content');
      expect(secondRead).toBe('some content');
    });
    it('should force read from source if cache is disabled', async () => {
      await write('some content', `${serverDir}/index.html`);
      const firstRead = await current(`${serverUrl}/index.html`, {
        memoryCache: false,
      });
      await write('updated content', `${serverDir}/index.html`);
      const secondRead = await current(`${serverUrl}/index.html`, {
        memoryCache: false,
      });

      expect(firstRead).toBe('some content');
      expect(secondRead).toBe('updated content');
    });
  });
  describe('diskCache', () => {
    it('should write file in disk cache if enabled', async () => {
      await write('some content', `${serverDir}/index.html`);
      await current(`${serverUrl}/index.html`, {
        memoryCache: false,
        diskCache: cacheDir,
      });

      const actual = (await glob(`${cacheDir}/**/index.html`))[0];
      expect(await read(actual)).toBe('some content');
    });
    it('should read file from disk if enabled', async () => {
      await write('some content', `${serverDir}/index.html`);
      await current(`${serverUrl}/index.html`, {
        memoryCache: false,
        diskCache: cacheDir,
      });

      const cacheFile = (await glob(`${cacheDir}/**/index.html`))[0];
      await write('updated content', cacheFile);

      const actual = await current(`${serverUrl}/index.html`, {
        memoryCache: false,
        diskCache: cacheDir,
      });

      expect(actual).toBe('updated content');
    });
  });
  describe('headers', () => {
    beforeEach(async () => {
      vi.spyOn(current, '__got').mockReturnValue({ body: 'content' });
    });
    it('allows passing custom headers to the request', async () => {
      const headers = { 'User-Agent': 'firost test' };
      await current(`${serverUrl}/index.html`, { headers });

      expect(current.__got).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ headers }),
      );
    });
  });
});

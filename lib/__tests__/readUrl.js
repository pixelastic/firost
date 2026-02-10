import { cache } from '../cache.js';
import { glob } from '../glob.js';
import { read } from '../read.js';
import { __, readUrl } from '../readUrl.js';
import { remove } from '../remove.js';
import { closeServer, startServer } from '../test-helpers/server.js';
import { tmpDirectory } from '../tmpDirectory.js';
import { write } from '../write.js';

describe('readUrl', () => {
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
      await readUrl(`${serverUrl}/nope.html`);
    } catch (err) {
      actual = err;
    }
    expect(actual).toHaveProperty('code', 'HTTP_ERROR_404');
  });
  describe('memoryCache', () => {
    it('should read subsequent calls from cache by default', async () => {
      await write('some content', `${serverDirectory}/index.html`);
      const firstRead = await readUrl(`${serverUrl}/index.html`);
      await write('updated content', `${serverDirectory}/index.html`);
      const secondRead = await readUrl(`${serverUrl}/index.html`);

      expect(firstRead).toBe('some content');
      expect(secondRead).toBe('some content');
    });
    it('should force read from source if cache is disabled', async () => {
      await write('some content', `${serverDirectory}/index.html`);
      const firstRead = await readUrl(`${serverUrl}/index.html`, {
        memoryCache: false,
      });
      await write('updated content', `${serverDirectory}/index.html`);
      const secondRead = await readUrl(`${serverUrl}/index.html`, {
        memoryCache: false,
      });

      expect(firstRead).toBe('some content');
      expect(secondRead).toBe('updated content');
    });
  });
  describe('diskCache', () => {
    it('should write file in disk cache if enabled', async () => {
      await write('some content', `${serverDirectory}/index.html`);
      await readUrl(`${serverUrl}/index.html`, {
        memoryCache: false,
        diskCache: cacheDirectory,
      });

      const actual = (await glob(`${cacheDirectory}/**/index.html`))[0];
      expect(await read(actual)).toBe('some content');
    });
    it('should read file from disk if enabled', async () => {
      await write('some content', `${serverDirectory}/index.html`);
      await readUrl(`${serverUrl}/index.html`, {
        memoryCache: false,
        diskCache: cacheDirectory,
      });

      const cacheFile = (await glob(`${cacheDirectory}/**/index.html`))[0];
      await write('updated content', cacheFile);

      const actual = await readUrl(`${serverUrl}/index.html`, {
        memoryCache: false,
        diskCache: cacheDirectory,
      });

      expect(actual).toBe('updated content');
    });
  });
  describe('headers', () => {
    beforeEach(async () => {
      vi.spyOn(__, 'fetch').mockReturnValue({
        ok: true,
        async text() {
          return 'content';
        },
      });
    });
    it('should pass some default headers', async () => {
      await readUrl(`${serverUrl}/index.html`);

      expect(__.fetch).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          headers: {
            'accept-encoding': 'gzip, deflate',
            'user-agent': 'firost',
            accept: '*/*',
          },
        }),
      );
    });
    it('should allow passing additional headers', async () => {
      const headers = { 'x-api-key': 'd34db33f' };
      await readUrl(`${serverUrl}/index.html`, { headers });

      expect(__.fetch).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          headers: expect.objectContaining({
            'x-api-key': 'd34db33f',
          }),
        }),
      );
    });
    it('should allow overwriting default headers', async () => {
      const headers = { 'User-Agent': 'my app' };
      await readUrl(`${serverUrl}/index.html`, { headers });

      expect(__.fetch).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          headers: expect.objectContaining({
            'user-agent': 'my app',
          }),
        }),
      );
    });
  });
});

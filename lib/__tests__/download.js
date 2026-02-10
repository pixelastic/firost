import { absolute } from '../absolute.js';
import { download } from '../download.js';
import { mkdirp } from '../mkdirp.js';
import { read } from '../read.js';
import { remove } from '../remove.js';
import { runInUserland } from '../test-helpers/runInUserland.js';
import { closeServer, startServer } from '../test-helpers/server.js';
import { tmpDirectory } from '../tmpDirectory.js';
import { write } from '../write.js';

describe('download', () => {
  const testDirectory = tmpDirectory(`firost/${describeName}`);
  const downloadDirectory = `${testDirectory}/download`;
  const serverDirectory = `${testDirectory}/server`;

  let serverUrl;
  beforeAll(async () => {
    serverUrl = await startServer(serverDirectory);
  });
  afterEach(async () => {
    await remove(testDirectory);
  });
  afterAll(() => {
    closeServer();
  });
  it('should write the file to disk', async () => {
    const destination = `${downloadDirectory}/target.txt`;

    await write('something', `${serverDirectory}/download.txt`);
    await download(`${serverUrl}/download.txt`, destination);

    const actual = await read(destination);
    expect(actual).toBe('something');
  });
  it('should create nested directories if they do not exist', async () => {
    const destination = `${downloadDirectory}/one/two/three/target.txt`;

    await write('something', `${serverDirectory}/download.txt`);
    await download(`${serverUrl}/download.txt`, destination);

    const actual = await read(destination);
    expect(actual).toBe('something');
  });
  it('should write the file to a directory if directory set as destination', async () => {
    const destination = `${downloadDirectory}/folder`;
    await mkdirp(destination);

    await write('something', `${serverDirectory}/download.txt`);
    await download(`${serverUrl}/download.txt`, destination);

    const actual = await read(`${destination}/download.txt`);
    expect(actual).toBe('something');
  });
  it('should save file with all its querystring', async () => {
    const destination = `${downloadDirectory}/folder`;
    await mkdirp(destination);

    await write('something', `${serverDirectory}/download.txt`);
    await download(`${serverUrl}/download.txt?foo=bar#baz`, destination);

    const actual = await read(`${destination}/download.txt?foo=bar#baz`);
    expect(actual).toBe('something');
  });
  it('should reject if the file does not exist', async () => {
    let actual;
    try {
      await download(`${serverUrl}/nope.nope`, downloadDirectory);
    } catch (error) {
      actual = error;
    }

    expect(actual).toHaveProperty('code', 'FIROST_DOWNLOAD_HTTP_404');
  });
  it('should return the file content', async () => {
    const destination = `${downloadDirectory}/target.txt`;

    await write('something', `${serverDirectory}/download.txt`);
    const actual = await download(`${serverUrl}/download.txt`, destination);

    expect(actual).toBe('something');
  });
  it('with relative paths', async () => {
    await write('something', `${serverDirectory}/download.txt`);

    await runInUserland(
      dedent`
        const { download } = await __import('./download.js');
        return await download('${serverUrl}/download.txt', './target.txt');
      `,
      absolute(testDirectory, 'lib/app.js'),
    );

    const actual = await read(`${testDirectory}/lib/target.txt`);
    expect(actual).toEqual('something');
  });
});

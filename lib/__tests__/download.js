import { absolute } from '../absolute.js';
import { download } from '../download.js';
import { closeServer, startServer } from '../test-helpers/server.js';
import { read } from '../read.js';
import { mkdirp } from '../mkdirp.js';
import { emptyDir } from '../emptyDir.js';
import { write } from '../write.js';
import { firostRoot } from '../test-helpers/firostRoot.js';

describe('download', () => {
  const downloadDir = absolute(firostRoot, '/tmp/download/download');
  const serverDir = absolute(firostRoot, '/tmp/download/server');
  let serverUrl;
  let serverStarted = false;
  beforeEach(async () => {
    await emptyDir(downloadDir);
    await emptyDir(serverDir);

    if (!serverStarted) {
      serverStarted = true;
      serverUrl = await startServer(serverDir);
      return;
    }
  });
  afterAll(() => {
    closeServer();
  });
  it('should write the file to disk', async () => {
    const destination = `${downloadDir}/target.txt`;

    await write('foo', `${serverDir}/download.txt`);
    await download(`${serverUrl}/download.txt`, destination);

    const actual = await read(destination);
    expect(actual).toBe('foo');
  });
  it('should create nested directories if they do not exist', async () => {
    const destination = `${downloadDir}/one/two/three/target.txt`;

    await write('foo', `${serverDir}/download.txt`);
    await download(`${serverUrl}/download.txt`, destination);

    const actual = await read(destination);
    expect(actual).toBe('foo');
  });
  it('should write the file to a directory if directory set as destination', async () => {
    const destination = `${downloadDir}/folder`;
    await mkdirp(destination);

    await write('foo', `${serverDir}/download.txt`);
    await download(`${serverUrl}/download.txt`, destination);

    const actual = await read(`${destination}/download.txt`);
    expect(actual).toBe('foo');
  });
  it('should save file with all its querystring', async () => {
    const destination = `${downloadDir}/folder`;
    await mkdirp(destination);

    await write('foo', `${serverDir}/download.txt`);
    await download(`${serverUrl}/download.txt?foo=bar#baz`, destination);

    const actual = await read(`${destination}/download.txt?foo=bar#baz`);
    expect(actual).toBe('foo');
  });
  it('should reject if the file does not exist', async () => {
    let actual;
    try {
      await download(`${serverUrl}/nope.nope`, downloadDir);
    } catch (error) {
      actual = error;
    }

    expect(actual).toHaveProperty('code', 'HTTP_ERROR_404');
  });
  it('should return the file content', async () => {
    const destination = `${downloadDir}/target.txt`;

    await write('foo', `${serverDir}/download.txt`);
    const actual = await download(`${serverUrl}/download.txt`, destination);

    expect(actual).toBe('foo');
  });
});

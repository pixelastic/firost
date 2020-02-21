const module = require('../download');
const helper = require('../test-helper');
const read = require('../read');
const mkdirp = require('../mkdirp');
const emptyDir = require('../emptyDir');
const write = require('../write');

describe('download', () => {
  const downloadDir = './tmp/download/download';
  const serverDir = './tmp/download/server';
  let serverUrl;
  let serverStarted = false;
  beforeEach(async () => {
    await emptyDir(downloadDir);
    await emptyDir(serverDir);

    if (!serverStarted) {
      serverStarted = true;
      serverUrl = await helper.startServer(serverDir);
      return;
    }
  });
  afterAll(() => {
    helper.closeServer();
  });
  it('should write the file to disk', async () => {
    const destination = `${downloadDir}/target.txt`;

    await write('foo', `${serverDir}/download.txt`);
    await module(`${serverUrl}/download.txt`, destination);

    const actual = await read(destination);
    expect(actual).toEqual('foo');
  });
  it('should create nested directories if they do not exist', async () => {
    const destination = `${downloadDir}/one/two/three/target.txt`;

    await write('foo', `${serverDir}/download.txt`);
    await module(`${serverUrl}/download.txt`, destination);

    const actual = await read(destination);
    expect(actual).toEqual('foo');
  });
  it('should write the file to a directory if directory set as destination', async () => {
    const destination = `${downloadDir}/folder`;
    await mkdirp(destination);

    await write('foo', `${serverDir}/download.txt`);
    await module(`${serverUrl}/download.txt`, destination);

    const actual = await read(`${destination}/download.txt`);
    expect(actual).toEqual('foo');
  });
  it('should save file with all its querystring', async () => {
    const destination = `${downloadDir}/folder`;
    await mkdirp(destination);

    await write('foo', `${serverDir}/download.txt`);
    await module(`${serverUrl}/download.txt?foo=bar#baz`, destination);

    const actual = await read(`${destination}/download.txt?foo=bar#baz`);
    expect(actual).toEqual('foo');
  });
  it('should reject if the file does not exist', async () => {
    let actual;
    try {
      await module(`${serverUrl}/nope.nope`, downloadDir);
    } catch (error) {
      actual = error;
    }

    expect(actual).toHaveProperty('code', 'HTTP_ERROR_404');
  });
  it('should return the file content', async () => {
    const destination = `${downloadDir}/target.txt`;

    await write('foo', `${serverDir}/download.txt`);
    const actual = await module(`${serverUrl}/download.txt`, destination);

    expect(actual).toEqual('foo');
  });
});

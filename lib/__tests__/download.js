import module from '../download';
import helper from '../test-helper';
import read from '../read';
import mkdirp from '../mkdirp';
const tmpPath = helper.tmpPath('download');
let serverUrl;

describe('download', () => {
  beforeAll(async () => {
    serverUrl = await helper.startServer();
  });
  afterAll(() => {
    helper.closeServer();
  });
  beforeEach(async () => {
    await helper.clearTmpDirectory('download');
  });

  it('should write the file to disk', async () => {
    const destination = `${tmpPath}/downloaded.txt`;
    await module(`${serverUrl}/root.txt`, destination);

    const actual = await read(destination);
    expect(actual).toEqual('root.txt');
  });
  it('should create nested directories if they do not exist', async () => {
    const destination = `${tmpPath}/foo/bar/destination.txt`;
    await module(`${serverUrl}/root.txt`, destination);

    const actual = await read(destination);
    expect(actual).toEqual('root.txt');
  });
  it('should write the file to a directory if directory set as destination', async () => {
    const destination = `${tmpPath}/foo`;
    // Creating the destination directory
    await mkdirp(destination);
    await module(`${serverUrl}/root.txt`, destination);

    const actual = await read(`${destination}/root.txt`);
    expect(actual).toEqual('root.txt');
  });
  it('should save file with all its querystring', async () => {
    const destination = `${tmpPath}`;
    await module(`${serverUrl}/root.txt?foo=bar#baz`, destination);

    const actual = await read(`${destination}/root.txt?foo=bar#baz`);
    expect(actual).toEqual('root.txt');
  });
  it('should reject if the file does not exist', async () => {
    let actual;
    try {
      await module(`${serverUrl}/nope.nope`, tmpPath);
    } catch (error) {
      actual = error;
    }

    expect(actual).toHaveProperty('code', 'HTTP_ERROR_404');
  });
});

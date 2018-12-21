import module from '../readJsonUrl';
import helper from '../test-helper';
let serverUrl;

describe('readJsonUrl', () => {
  beforeAll(async () => {
    serverUrl = await helper.startServer();
  });
  afterAll(() => {
    helper.closeServer();
  });
  it('should reject if no such file exists', async () => {
    let actual;
    try {
      await module(`${serverUrl}/nope.json`);
    } catch (err) {
      actual = err;
    }
    expect(actual).toHaveProperty('code', 'HTTP_ERROR_404');
  });
  it('should reject if the file is not JSON', async () => {
    let actual;
    try {
      await module(`${serverUrl}/root.txt`);
    } catch (err) {
      actual = err;
    }
    expect(actual).toHaveProperty('code', 'ERROR_NOT_JSON');
  });
  it('should return the parsed JSON', async () => {
    const actual = await module(`${serverUrl}/settings.json`);

    expect(actual).toHaveProperty('foo', 'bar');
  });
});

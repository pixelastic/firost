const current = require('../env');

describe('env', () => {
  const envSnapshot = { ...process.env };
  afterEach(async () => {
    process.env = { ...envSnapshot };
  });
  it('should return the env variable if set', async () => {
    process.env.FIROST_TOKEN = 't0k3n';
    expect(current('FIROST_TOKEN')).toEqual('t0k3n');
  });
  it('should return undefined if the env variable is not set', async () => {
    expect(current('FIROST_NOT_SET')).toEqual(undefined);
  });
  it('should fallback to the specified value if no env variable set', async () => {
    expect(current('FIROST_NOT_SET', 'fallbackValue')).toEqual('fallbackValue');
  });
});

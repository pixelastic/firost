const current = require('../env');

describe('env', () => {
  it('should return the env variable if set', async () => {
    expect(current('FIROST_NOT_SET')).toEqual(undefined);
  });
  it('should return undefined if the env variable is not set', async () => {
    process.env.FIROST_TOKEN = 't0k3n';
    expect(current('FIROST_TOKEN')).toEqual('t0k3n');
  });
});

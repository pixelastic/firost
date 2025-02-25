import { env } from '../env.js';

describe('env', () => {
  const envSnapshot = { ...process.env };
  afterEach(async () => {
    process.env = { ...envSnapshot };
  });
  it('should return the env variable if set', async () => {
    process.env.FIROST_TOKEN = 't0k3n';
    expect(env('FIROST_TOKEN')).toBe('t0k3n');
  });
  it('should return undefined if the env variable is not set', async () => {
    expect(env('FIROST_NOT_SET')).toBeUndefined();
  });
  it('should fallback to the specified value if no env variable set', async () => {
    expect(env('FIROST_NOT_SET', 'fallbackValue')).toBe('fallbackValue');
  });
});

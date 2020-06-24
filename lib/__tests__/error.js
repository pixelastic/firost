const current = require('../error');

describe('error', () => {
  it('should return an error with both message and code', async () => {
    const actual = current('FOO', 'bar');

    expect(actual instanceof Error).toEqual(true);
    expect(actual).toHaveProperty('code', 'FOO');
    expect(actual).toHaveProperty('message', 'bar');
  });
});

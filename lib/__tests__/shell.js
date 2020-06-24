const current = require('../shell');

describe('shell', () => {
  it('should return the stdout if success', async () => {
    const actual = await current('echo "foo"');
    expect(actual).toEqual('foo');
  });
  it('should reject with the error message and exit code if fails', async () => {
    let actual;
    try {
      await current('>&2 echo "fail"; exit 42');
    } catch (error) {
      actual = error;
    }

    expect(actual).toHaveProperty('code', 42);
    expect(actual).toHaveProperty('message', 'fail');
  });
});

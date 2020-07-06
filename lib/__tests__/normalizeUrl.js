const current = require('../normalizeUrl');

describe('normalizeUrl', () => {
  it.each([
    ['http://there.com', 'http://there.com'],
    ['http://there.com/', 'http://there.com'],
    ['http://there.com/index.html', 'http://there.com'],
    [
      'http://there.com/?sort=asc&name=firost',
      'http://there.com/?name=firost&sort=asc',
    ],
  ])('%s', async (input, expected) => {
    const actual = current(input);
    expect(actual).toEqual(expected);
  });
});

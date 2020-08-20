const current = require('../normalizeUrl');

describe('normalizeUrl', () => {
  it.each([
    ['http://there.com', 'http://there.com/', {}],
    ['http://there.com/', 'http://there.com/', {}],
    ['http://there.com/index.html', 'http://there.com/', {}],

    ['http://there.com?sort=asc', 'http://there.com/?sort=asc', {}],
    ['http://there.com/?sort=asc', 'http://there.com/?sort=asc', {}],
    ['http://there.com/index.html?sort=asc', 'http://there.com/?sort=asc', {}],

    ['http://there.com/blog', 'http://there.com/blog/', {}],
    ['http://there.com/blog/', 'http://there.com/blog/', {}],
    ['http://there.com/blog/index.html', 'http://there.com/blog/', {}],

    ['http://there.com/blog?sort=asc', 'http://there.com/blog/?sort=asc', {}],
    ['http://there.com/blog/?sort=asc', 'http://there.com/blog/?sort=asc', {}],
    [
      'http://there.com/blog/index.html?sort=asc',
      'http://there.com/blog/?sort=asc',
      {},
    ],

    ['http://there.com/blog/.././index.html', 'http://there.com/', {}],

    [
      'http://there.com/?sort=asc&name=firost',
      'http://there.com/?name=firost&sort=asc',
      {},
    ],

    [
      'http://there.com/blog/index.html',
      'http://there.com/blog/index.html',
      { removeDirectoryIndex: false },
    ],
    [
      'http://there.com/blog',
      'http://there.com/blog/',
      { removeDirectoryIndex: false },
    ],
    [
      'http://there.com/blog/',
      'http://there.com/blog/',
      { removeDirectoryIndex: false },
    ],
  ])('%s', async (input, expected, options) => {
    const actual = current(input, options);
    expect(actual).toEqual(expected);
  });
});

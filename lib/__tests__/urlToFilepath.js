const current = require('../urlToFilepath');

describe('urlToFilepath', () => {
  it.each([
    // input | options | expected
    [
      'http://www.example.com/index.html',
      {},
      'http/www.example.com/index.html',
    ],
    [
      'https://www.example.com/index.html',
      {},
      'https/www.example.com/index.html',
    ],
    [
      'https://www.example.com/subpath/index.html',
      {},
      'https/www.example.com/subpath/index.html',
    ],
    [
      'https://www.example.com/subpath/index.html#id',
      {},
      'https/www.example.com/subpath/index.html',
    ],
    [
      'https://www.example.com/subpath/index.html?key=value',
      {},
      'https/www.example.com/subpath/index_key-value.html',
    ],
    [
      'https://www.example.com/subpath/index.html?sort=asc&name=firost',
      {},
      'https/www.example.com/subpath/index_name-firost_sort-asc.html',
    ],
    [
      'https://www.example.com/subpath/index.html?name=firost&sort=asc',
      {},
      'https/www.example.com/subpath/index_name-firost_sort-asc.html',
    ],
    [
      'subpath/index.html?name=firost&sort=asc',
      {},
      'subpath/index_name-firost_sort-asc.html',
    ],
    [
      'https://www.example.com/foo',
      { extension: 'json' },
      'https/www.example.com/foo.json',
    ],
    [
      'https://www.example.com/foo.html',
      { extension: 'json' },
      'https/www.example.com/foo.json',
    ],
    [
      'https://www.example.com/foo?sort=asc',
      { extension: 'json' },
      'https/www.example.com/foo_sort-asc.json',
    ],
    [
      'https://www.example.com/foo.html?sort=asc',
      { extension: 'json' },
      'https/www.example.com/foo_sort-asc.json',
    ],
    [
      'subpath/index?firost',
      { extension: 'json' },
      'subpath/index_firost.json',
    ],
    [
      'subpath/index?firost=false',
      { extension: 'json' },
      'subpath/index_firost-false.json',
    ],
    [
      'subpath/index?count=0',
      { extension: 'json' },
      'subpath/index_count-0.json',
    ],
    [
      '/subpath/index.php?sort=asc',
      { extension: 'json' },
      'subpath/index_sort-asc.json',
    ],
    [
      'https://there.com/subfolder/?sort=asc',
      { extension: 'json' },
      'https/there.com/subfolder_sort-asc.json',
    ],
    [
      'https://there.com/subfolder?sort=asc',
      { extension: 'json' },
      'https/there.com/subfolder_sort-asc.json',
    ],
  ])('%s (%s)', async (input, options, expected) => {
    const actual = current(input, options);
    expect(actual).toEqual(expected);
  });
});

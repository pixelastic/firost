import { urlToFilepath } from '../urlToFilepath.js';

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
      'https://www.example.com/subpath/index.html?key=value%20with%20encoded%20space',
      {},
      'https/www.example.com/subpath/index_key-value_with_encoded_space.html',
    ],
    [
      'https://www.example.com/subpath/index.html?key=value with space',
      {},
      'https/www.example.com/subpath/index_key-value_with_space.html',
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
    [
      'https://www.googleapis.com/youtube/v3/videos?id=Z1uVLa2lmZY%2Ctr6aHw8I32M%2CU_JPafSqkaE%2CW98GBTn-T5k%2C0IMMaX62ezY%2C5nITeKhoa1E%2C8kMYboWh4kI%2CspyKZ-p3UgE%2C4K4_5yLLqzM%2C31COiWAmZso%2CdBHUir4I13c%2Czbdfqfn1yiM%2CTT-2rQsHyqQ%2Cj2C0SIJFlv8%2CDRHS3UEdoN0%2C5xkDnOemjLk%2CY1I6S5v4ZYs%2CRTraenhnqrY%2ChYYCE3cPl6I%2C-NMf5zkdbQw%2CfFB-7906eUA%2CEWQJuXlvoiQ%2C5DnJmVKiqZY%2CoibCVDK_-60%2C4xAF3r29GhQ&maxResults=50&part=snippet%2CcontentDetails%2Cstatistics',
      {},
      'https/www.googleapis.com/youtube/v3/videos_id-Z1uVLa2lmZY,tr6aHw8I32M,U_JPafSqkaE,W98G_7ceb24e8aa_xResults-50_part-snippet,contentDetails,statistics',
    ],
  ])('%s (%s)', async (input, options, expected) => {
    const actual = urlToFilepath(input, options);
    expect(actual).toEqual(expected);
  });
});

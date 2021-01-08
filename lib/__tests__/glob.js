const current = require('../glob');
const mkdirp = require('../mkdirp');
const write = require('../write');
const emptyDir = require('../emptyDir');
const path = require('path');
const pMap = require('golgoth/pMap');
const _ = require('golgoth/lodash');

describe('glob', () => {
  const tmpDir = path.resolve('./tmp/glob');
  beforeEach(async () => {
    await emptyDir(tmpDir);
  });
  it.each([
    ['match on extensions', ['notes.txt'], '*.txt', ['notes.txt']],
    ['find directories', ['directory/'], '*', ['directory']],
    [
      'directories: false',
      ['directory/'],
      '*',
      ['directory'],
      { directories: false },
    ],
    ['hidden files', ['.gitignore'], '*', ['.gitignore']],
    ['hiddenFiles: false', ['.gitignore'], '*', [], { hiddenFiles: false }],
    [
      'deep ** matches',
      ['index.js', 'lib/main.js', 'lib/utils/helper.js'],
      '**/*.js',
      ['index.js', 'lib/main.js', 'lib/utils/helper.js'],
    ],
    [
      'ordered results',

      [
        'picture_10',
        'picture_1',
        'picture_18',
        'picture_180',
        'picture_100',
        'picture_bar',
        'picture_179',
      ],
      'picture*',
      [
        'picture_1',
        'picture_10',
        'picture_18',
        'picture_100',
        'picture_179',
        'picture_180',
        'picture_bar',
      ],
    ],
    [
      'patterns as array',

      ['notes.txt', 'readme.md'],
      ['*.txt', '*.md'],
      ['notes.txt', 'readme.md'],
    ],
    [
      'negated patterns in array',
      ['index.js', 'lib/main.js', 'lib/__tests__/main.js'],
      ['**/*.js', '!**/__tests__/*.js'],
      ['index.js', 'lib/main.js'],
    ],
    [
      'one level glob',
      [
        'data/0001/metadata.json',
        'data/0002/metadata.json',
        'data/0002/videos/metadata.json',
      ],
      'data/*/*.json',
      ['data/0001/metadata.json', 'data/0002/metadata.json'],
    ],
  ])('%s', async (_title, files, patterns, rawExpected, rawOptions = {}) => {
    // Prefix all expected by the tmp dir
    const expected = _.map(rawExpected, (filepath) => {
      return `${tmpDir}/${filepath}`;
    });

    // We create the files/directories
    await pMap(files, async (filepath) => {
      const fullPath = `${tmpDir}/${filepath}`;
      const isDirectory = filepath[-1] === '/';

      isDirectory ? await mkdirp(fullPath) : await write('content', fullPath);
    });

    // Make glob resolve from tmpDir
    const options = {
      context: tmpDir,
      ...rawOptions,
    };

    const actual = await current(patterns, options);
    expect(actual).toEqual(expected);
  });
});

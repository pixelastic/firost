import { pMap } from 'golgoth';
import { glob } from '../glob.js';
import { mkdirp } from '../mkdirp.js';
import { newFile } from '../newFile/index.js';
import { emptyDir } from '../emptyDir.js';
import { absolute } from '../absolute.js';
import firostRoot from '../test-helpers/firostRoot.js';

describe('glob', () => {
  const tmpDir = absolute(firostRoot, '/tmp/glob');
  beforeEach(async () => {
    await emptyDir(tmpDir);
  });
  it.each([
    ['match on extensions', ['notes.txt'], '*.txt', [`${tmpDir}/notes.txt`]],
    ['find directories', ['directory/'], '*', [`${tmpDir}/directory`]],
    ['directories: false', ['directory/'], '*', [], { directories: false }],
    ['hidden files', ['.gitignore'], '*', [`${tmpDir}/.gitignore`]],
    ['hiddenFiles: false', ['.gitignore'], '*', [], { hiddenFiles: false }],
    [
      'deep ** matches',
      ['index.js', 'lib/main.js', 'lib/utils/helper.js'],
      '**/*.js',
      [
        `${tmpDir}/index.js`,
        `${tmpDir}/lib/main.js`,
        `${tmpDir}/lib/utils/helper.js`,
      ],
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
        `${tmpDir}/picture_1`,
        `${tmpDir}/picture_10`,
        `${tmpDir}/picture_18`,
        `${tmpDir}/picture_100`,
        `${tmpDir}/picture_179`,
        `${tmpDir}/picture_180`,
        `${tmpDir}/picture_bar`,
      ],
    ],
    [
      'patterns as array',

      ['notes.txt', 'readme.md'],
      ['*.txt', '*.md'],
      [`${tmpDir}/notes.txt`, `${tmpDir}/readme.md`],
    ],
    [
      'negated patterns in array',
      ['index.js', 'lib/main.js', 'lib/__tests__/main.js'],
      ['**/*.js', '!**/__tests__/*.js'],
      [`${tmpDir}/index.js`, `${tmpDir}/lib/main.js`],
    ],
    [
      'one level glob',
      [
        'data/0001/metadata.json',
        'data/0002/metadata.json',
        'data/0002/videos/metadata.json',
      ],
      'data/*/*.json',
      [
        `${tmpDir}/data/0001/metadata.json`,
        `${tmpDir}/data/0002/metadata.json`,
      ],
    ],
    [
      'absolutePaths: false',
      ['index.js', 'lib/main.js'],
      '**/*',
      ['index.js', 'lib', 'lib/main.js'],
      { absolutePaths: false },
    ],
  ])('%s', async (_title, files, patterns, expected, rawOptions = {}) => {
    // We create the files/directories
    await pMap(files, async (filepath) => {
      const fullPath = `${tmpDir}/${filepath}`;
      const isDirectory = filepath[-1] === '/';

      isDirectory ? await mkdirp(fullPath) : await newFile(fullPath);
    });

    // Make glob resolve from tmpDir
    const options = {
      cwd: tmpDir,
      ...rawOptions,
    };

    const actual = await glob(patterns, options);
    expect(actual).toEqual(expected);
  });
});

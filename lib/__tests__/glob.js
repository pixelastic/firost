import { pMap } from 'golgoth';
import { glob } from '../glob.js';
import { mkdirp } from '../mkdirp.js';
import { newFile } from '../newFile/index.js';
import { absolute } from '../absolute.js';
import { runInUserland } from '../test-helpers/runInUserland.js';
import { tmpDirectory } from '../tmpDirectory.js';
import { remove } from '../remove.js';

describe('glob', () => {
  const testDirectory = tmpDirectory('firost/glob');
  afterEach(async () => {
    await remove(testDirectory);
  });
  it.each([
    [
      'match on extensions',
      ['notes.txt'],
      '*.txt',
      [`${testDirectory}/notes.txt`],
    ],
    ['find directories', ['directory/'], '*', [`${testDirectory}/directory`]],
    ['directories: false', ['directory/'], '*', [], { directories: false }],
    ['hidden files', ['.yarnrc.yml'], '*', [`${testDirectory}/.yarnrc.yml`]],
    ['hiddenFiles: false', ['.yarnrc.yml'], '*', [], { hiddenFiles: false }],
    [
      'deep ** matches',
      ['index.js', 'lib/main.js', 'lib/utils/helper.js'],
      '**/*.js',
      [
        `${testDirectory}/index.js`,
        `${testDirectory}/lib/main.js`,
        `${testDirectory}/lib/utils/helper.js`,
      ],
    ],
    [
      'absolute patterns given',
      ['notes.txt'],
      `${testDirectory}/*.txt`,
      [`${testDirectory}/notes.txt`],
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
        `${testDirectory}/picture_1`,
        `${testDirectory}/picture_10`,
        `${testDirectory}/picture_18`,
        `${testDirectory}/picture_100`,
        `${testDirectory}/picture_179`,
        `${testDirectory}/picture_180`,
        `${testDirectory}/picture_bar`,
      ],
    ],
    [
      'patterns as array',

      ['notes.txt', 'readme.md'],
      ['*.txt', '*.md'],
      [`${testDirectory}/notes.txt`, `${testDirectory}/readme.md`],
    ],
    [
      'negated patterns in array',
      ['index.js', 'lib/main.js', 'lib/__tests__/main.js'],
      ['**/*.js', '!**/__tests__/*.js'],
      [`${testDirectory}/index.js`, `${testDirectory}/lib/main.js`],
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
        `${testDirectory}/data/0001/metadata.json`,
        `${testDirectory}/data/0002/metadata.json`,
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
      await newFile(`${testDirectory}/${filepath}`);
    });

    // Make glob resolve from testDirectory
    const options = {
      cwd: testDirectory,
      ...rawOptions,
    };

    const actual = await glob(patterns, options);
    expect(actual).toEqual(expected);
  });
  it('with <placeholders>', async () => {
    // Given
    await mkdirp(absolute(testDirectory, '.git'));
    await newFile(absolute(testDirectory, 'story.txt'));
    await newFile(absolute(testDirectory, 'image.png'));
    await newFile(absolute(testDirectory, 'image.jpg'));

    // When
    const actual = await runInUserland(
      dedent`
          const { glob } = await __import('./glob.js');
          const one = await glob('<gitRoot>/*.txt');
          const two = await glob([
            '<gitRoot>/image.*',
            '!<gitRoot>/*.png'
          ]);
          return { one, two }

        `,
      absolute(testDirectory, 'lib/app.js'),
    );

    // Then
    expect(actual).toEqual({
      one: [`${testDirectory}/story.txt`],
      two: [`${testDirectory}/image.jpg`],
    });
  });
  it('with absolutePaths: false, with absolute and relative inputs', async () => {
    // Note this specific combination doesn't make sense: it's not possible to
    // return a relative path when the inputs are both relative and absolute
    // paths, so we warn the user if it happens

    // Given
    await newFile(absolute(testDirectory, 'lib/main.js'));
    await newFile(absolute(testDirectory, 'tool.config.js'));

    // When
    let actual = null;
    try {
      await glob(
        [`${testDirectory}/*.config.js`, `${testDirectory}/lib/*.js`],
        {
          cwd: `${testDirectory}/lib`,
          absolutePaths: false,
        },
      );
    } catch (err) {
      actual = err;
    }
    expect(actual).toHaveProperty(
      'code',
      'FIROST_GLOB_RELATIVE_OUTPUT_WITH_ABSOLUTE_AND_RELATIVE_INPUTS',
    );
  });
});

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
  beforeAll(async () => {
    // TODO: Case insentive?
    await newFile(`${testDirectory}/readme.md`);
    await newFile(`${testDirectory}/.yarnrc.yml`);
    await newFile(`${testDirectory}/tool.config.js`);

    await newFile(`${testDirectory}/assets/pictures/picture_1.png`);
    await newFile(`${testDirectory}/assets/pictures/picture_10.png`);
    await newFile(`${testDirectory}/assets/pictures/picture_18.png`);
    await newFile(`${testDirectory}/assets/pictures/picture_100.png`);
    await newFile(`${testDirectory}/assets/pictures/picture_179.png`);
    await newFile(`${testDirectory}/assets/pictures/picture_180.png`);
    await newFile(`${testDirectory}/assets/pictures/picture_bar.png`);

    await newFile(`${testDirectory}/metadata/001/metadata.json`);
    await newFile(`${testDirectory}/metadata/002/metadata.json`);
    await newFile(`${testDirectory}/metadata/042/metadata.json`);

    await newFile(`${testDirectory}/lib/main.js`);
    await newFile(`${testDirectory}/lib/__tests__/main.js`);
  });
  afterAll(async () => {
    await remove(testDirectory);
  });
  describe('happy path', () => {
    it.each([
      [
        {
          title: 'Simple pattern as array',
          patterns: ['*.md'],
          options: {
            cwd: testDirectory,
          },
          expected: [`${testDirectory}/readme.md`],
        },
      ],
      [
        {
          title: 'Simple pattern as string',
          patterns: '*.md',
          options: {
            cwd: testDirectory,
          },
          expected: [`${testDirectory}/readme.md`],
        },
      ],
      [
        {
          title: 'Case insensitive match',
          patterns: ['README.md'],
          options: {
            cwd: testDirectory,
          },
          expected: [`${testDirectory}/readme.md`],
        },
      ],
      [
        {
          title: 'Find all at root',
          patterns: ['*'],
          options: {
            cwd: testDirectory,
          },
          expected: [
            `${testDirectory}/assets`,
            `${testDirectory}/lib`,
            `${testDirectory}/metadata`,
            `${testDirectory}/.yarnrc.yml`,
            `${testDirectory}/readme.md`,
            `${testDirectory}/tool.config.js`,
          ],
        },
      ],
      [
        {
          title: 'One level deep * pattern',
          patterns: 'metadata/*/*.json',
          options: {
            cwd: testDirectory,
          },
          expected: [
            `${testDirectory}/metadata/001/metadata.json`,
            `${testDirectory}/metadata/002/metadata.json`,
            `${testDirectory}/metadata/042/metadata.json`,
          ],
        },
      ],
      [
        {
          title: 'Deep ** find',
          patterns: ['**/*.js'],
          options: {
            cwd: testDirectory,
          },
          expected: [
            `${testDirectory}/tool.config.js`,
            `${testDirectory}/lib/main.js`,
            `${testDirectory}/lib/__tests__/main.js`,
          ],
        },
      ],
      [
        {
          title: 'Negated pattern',
          patterns: ['**/*.js', '!**/__tests__/*.js'],
          options: {
            cwd: testDirectory,
          },
          expected: [
            `${testDirectory}/tool.config.js`,
            `${testDirectory}/lib/main.js`,
          ],
        },
      ],
      [
        {
          title: 'Lexicographical order',
          patterns: ['**/*.png'],
          options: {
            cwd: testDirectory,
          },
          expected: [
            `${testDirectory}/assets/pictures/picture_1.png`,
            `${testDirectory}/assets/pictures/picture_10.png`,
            `${testDirectory}/assets/pictures/picture_18.png`,
            `${testDirectory}/assets/pictures/picture_100.png`,
            `${testDirectory}/assets/pictures/picture_179.png`,
            `${testDirectory}/assets/pictures/picture_180.png`,
            `${testDirectory}/assets/pictures/picture_bar.png`,
          ],
        },
      ],
      [
        {
          title: 'Absolute patterns and no cwd',
          patterns: [`${testDirectory}/assets/*`, `${testDirectory}/lib/*`],
          options: {},
          expected: [
            `${testDirectory}/assets/pictures`,
            `${testDirectory}/lib/__tests__`,
            `${testDirectory}/lib/main.js`,
          ],
        },
      ],
      [
        {
          title: 'directories: false',
          patterns: ['*'],
          options: {
            cwd: testDirectory,
            directories: false,
          },
          expected: [
            `${testDirectory}/.yarnrc.yml`,
            `${testDirectory}/readme.md`,
            `${testDirectory}/tool.config.js`,
          ],
        },
      ],
      [
        {
          title: 'hiddenFiles: false',
          patterns: ['*'],
          options: {
            cwd: testDirectory,
            hiddenFiles: false,
          },
          expected: [
            `${testDirectory}/assets`,
            `${testDirectory}/lib`,
            `${testDirectory}/metadata`,
            `${testDirectory}/readme.md`,
            `${testDirectory}/tool.config.js`,
          ],
        },
      ],
      [
        {
          title: 'absolutePaths: false',
          patterns: ['**/*.js'],
          options: {
            cwd: testDirectory,
            absolutePaths: false,
          },
          expected: ['tool.config.js', 'lib/main.js', 'lib/__tests__/main.js'],
        },
      ],
    ])('$title', async ({ patterns, options, expected }) => {
      const actual = await glob(patterns, options);
      expect(actual).toEqual(expected);
    });
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
  describe('impossible options', () => {
    it.each([
      [
        {
          title: 'Relative patterns without a cwd',
          patterns: ['*.md'],
          options: {},
          expected: 'FIROST_GLOB_RELATIVE_PATTERN_MISSING_CWD',
        },
      ],
      [
        {
          title: 'Relative outputs without a cwd',
          patterns: [`${testDirectory}/*.md`],
          options: {
            absolutePaths: false,
          },
          expected: 'FIROST_GLOB_RELATIVE_OUTPUT_MISSING_CWD',
        },
      ],
    ])('$title', async ({ patterns, options, expected }) => {
      let actual = null;
      try {
        await glob(patterns, options);
      } catch (err) {
        actual = err;
      }
      expect(actual).toHaveProperty('code', expected);
    });
  });
});

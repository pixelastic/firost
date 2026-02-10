import { tmpDirectory } from 'firost';
import { mkdirp } from '../../../mkdirp.js';
import { getCommonParentDirectory } from '../getCommonParentDirectory.js';

describe('getCommonParentDirectory', () => {
  const testDirectory = tmpDirectory('firost/watch/getCommonParentDirectory');
  beforeAll(async () => {
    await mkdirp(testDirectory);
    await mkdirp(`${testDirectory}/subdir/one/alpha`);
    await mkdirp(`${testDirectory}/subdir/one/beta`);
    await mkdirp(`${testDirectory}/subdir/two`);
  });
  it.each([
    // Static paths
    [
      'Shared direct parent',
      [`${testDirectory}/subdir/one/alpha`, `${testDirectory}/subdir/one/beta`],
      `${testDirectory}/subdir/one`,
    ],
    [
      'Deep subdir and parent',
      [`${testDirectory}/subdir/one/alpha`, `${testDirectory}/subdir`],
      `${testDirectory}/subdir`,
    ],
    [
      'Parent and deep subdir',
      [`${testDirectory}/subdir`, `${testDirectory}/subdir/one/alpha`],
      `${testDirectory}/subdir`,
    ],
    [
      'Specific deep subdirs and sibling',
      [
        `${testDirectory}/subdir/one/beta`,
        `${testDirectory}/subdir/one/alpha`,
        `${testDirectory}/subdir/two`,
      ],
      `${testDirectory}/subdir`,
    ],

    // Simple glob
    [
      'Glob in deep subdirs',
      [`${testDirectory}/subdir/one/*`, `${testDirectory}/subdir/one/alpha/*`],
      `${testDirectory}/subdir/one`,
    ],
    [
      'Globs in siblings',
      [`${testDirectory}/subdir/one/*`, `${testDirectory}/subdir/*`],
      `${testDirectory}/subdir`,
    ],
    [
      'Globs in filenames',
      [
        `${testDirectory}/subdir/one/foo_*`,
        `${testDirectory}/subdir/one/bar_*`,
      ],
      `${testDirectory}/subdir/one`,
    ],

    // Double glob
    [
      'Double globs in deep subdir and parent',
      [`${testDirectory}/subdir/**`, `${testDirectory}/subdir/one/alpha`],
      `${testDirectory}/subdir`,
    ],
    [
      'Double globs in the middle',
      [`${testDirectory}/subdir/one/**/foo`, `${testDirectory}/subdir/**/foo`],
      `${testDirectory}/subdir`,
    ],

    // Should only return directories that actually exist
    [
      'Non-existing subdirs',
      [
        `${testDirectory}/subdir/does/not/exist`,
        `${testDirectory}/subdir/does/not/exist/either`,
      ],
      `${testDirectory}/subdir`,
    ],

    // Negative glob patterns
    [
      'Excluding a specific subdir',
      [`${testDirectory}/subdir`, `!${testDirectory}/subdir/one`],
      `${testDirectory}/subdir`,
    ],
    [
      'Excluding globs in subdir',
      [`${testDirectory}/subdir/one/*`, `!${testDirectory}/subdir/one/alpha/*`],
      `${testDirectory}/subdir/one`,
    ],
  ])('%s', async (_title, input, expected) => {
    const actual = await getCommonParentDirectory(input);
    expect(actual).toEqual(expected);
  });
});

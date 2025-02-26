import { absolute } from '../../../absolute.js';
import { mkdirp } from '../../../mkdirp.js';
import { getCommonParentDirectory } from '../getCommonParentDirectory.js';
import { firostRoot } from '../../../test-helpers/firostRoot.js';

describe('getCommonParentDirectory', () => {
  const tmpDir = absolute(firostRoot, '/tmp/watch/helper');
  beforeAll(async () => {
    await mkdirp(tmpDir);
    await mkdirp(`${tmpDir}/subdir/one/alpha`);
    await mkdirp(`${tmpDir}/subdir/one/beta`);
    await mkdirp(`${tmpDir}/subdir/two`);
  });
  it.each([
    // Static paths
    [
      'Shared direct parent',
      [`${tmpDir}/subdir/one/alpha`, `${tmpDir}/subdir/one/beta`],
      `${tmpDir}/subdir/one`,
    ],
    [
      'Deep subdir and parent',
      [`${tmpDir}/subdir/one/alpha`, `${tmpDir}/subdir`],
      `${tmpDir}/subdir`,
    ],
    [
      'Parent and deep subdir',
      [`${tmpDir}/subdir`, `${tmpDir}/subdir/one/alpha`],
      `${tmpDir}/subdir`,
    ],
    [
      'Specific deep subdirs and sibling',
      [
        `${tmpDir}/subdir/one/beta`,
        `${tmpDir}/subdir/one/alpha`,
        `${tmpDir}/subdir/two`,
      ],
      `${tmpDir}/subdir`,
    ],

    // Simple glob
    [
      'Glob in deep subdirs',
      [`${tmpDir}/subdir/one/*`, `${tmpDir}/subdir/one/alpha/*`],
      `${tmpDir}/subdir/one`,
    ],
    [
      'Globs in siblings',
      [`${tmpDir}/subdir/one/*`, `${tmpDir}/subdir/*`],
      `${tmpDir}/subdir`,
    ],
    [
      'Globs in filenames',
      [`${tmpDir}/subdir/one/foo_*`, `${tmpDir}/subdir/one/bar_*`],
      `${tmpDir}/subdir/one`,
    ],

    // Double glob
    [
      'Double globs in deep subdir and parent',
      [`${tmpDir}/subdir/**`, `${tmpDir}/subdir/one/alpha`],
      `${tmpDir}/subdir`,
    ],
    [
      'Double globs in the middle',
      [`${tmpDir}/subdir/one/**/foo`, `${tmpDir}/subdir/**/foo`],
      `${tmpDir}/subdir`,
    ],
    // Single argument
    ['Only one subdir', `${tmpDir}/subdir/one`, `${tmpDir}/subdir`],
    ['Glob in one subdir', `${tmpDir}/subdir/*`, `${tmpDir}/subdir`],
    [
      'Double glob in one deep subdir',
      `${tmpDir}/subdir/one/**/*`,
      `${tmpDir}/subdir/one`,
    ],

    // Should only return directories that actually exist
    [
      'Non-existing subdirs',
      [
        `${tmpDir}/subdir/does/not/exist`,
        `${tmpDir}/subdir/does/not/exist/either`,
      ],
      `${tmpDir}/subdir`,
    ],

    // Negative glob patterns
    [
      'Excluding a specific subdir',
      [`${tmpDir}/subdir`, `!${tmpDir}/subdir/one`],
      `${tmpDir}/subdir`,
    ],
    [
      'Excluding globs in subdir',
      [`${tmpDir}/subdir/one/*`, `!${tmpDir}/subdir/one/alpha/*`],
      `${tmpDir}/subdir/one`,
    ],
  ])('%s', async (_title, input, expected) => {
    const actual = await getCommonParentDirectory(input);
    expect(actual).toEqual(expected);
  });
});

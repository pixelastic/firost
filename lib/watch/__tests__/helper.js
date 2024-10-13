import path from 'path';
import { _ } from 'golgoth';
import absolute from '../../absolute.js';
import mkdirp from '../../mkdirp.js';
import current from '../helper/index.js';

describe('helper', () => {
  describe('getCommonParentDirectory', () => {
    const tmpDir = absolute('<gitRoot>/tmp/watch/helper');
    beforeAll(async () => {
      await mkdirp(tmpDir);
      await mkdirp(`${tmpDir}/subdir/one/alpha`);
      await mkdirp(`${tmpDir}/subdir/one/beta`);
      await mkdirp(`${tmpDir}/subdir/two`);
    });
    it.each([
      // Static paths
      [['./subdir/one/alpha', './subdir/one/beta'], './subdir/one'],
      [['./subdir/one/alpha', './subdir'], './subdir'],
      [['./subdir', './subdir/one/alpha'], './subdir'],
      [['./subdir/one/beta', './subdir/one/alpha', './subdir/two'], './subdir'],
      [['./subdir/one/beta', './subdir'], './subdir'],
      // Simple glob
      [['./subdir/one/*', './subdir/one/alpha/*'], './subdir/one'],
      [['./subdir/one/*', './subdir/*'], './subdir'],
      [['./subdir/one/foo_*', './subdir/one/bar_*'], './subdir/one'],
      // Double glob
      [['./subdir/**', './subdir/one/alpha'], './subdir'],
      [['./subdir/one/**/foo', './subdir/**/foo'], './subdir'],
      // Single argument
      ['./subdir/one', './subdir'],
      ['./subdir/*', './subdir'],
      ['./subdir/one/**/*', './subdir/one'],
      // Should only return directories that actually exist
      [
        ['./subdir/does/not/exist', './subdir/does/not/exist/either'],
        './subdir',
      ],
    ])('%s is %s', async (rawInput, rawExpected) => {
      // Make all paths relative to the tmpDirectory
      const input = _.chain(rawInput)
        .castArray()
        .map((item) => {
          return path.resolve(tmpDir, item);
        })
        .value();
      const expected = path.resolve(tmpDir, rawExpected);

      const actual = await current.getCommonParentDirectory(input);
      expect(actual).toEqual(expected);
    });
  });
});

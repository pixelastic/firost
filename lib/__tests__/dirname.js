import path from 'node:path';
import { dirname } from '../dirname.js';
import { exists } from '../exists.js';
import { firostRoot } from '../test-helpers/firostRoot.js';

describe('dirname', () => {
  describe('with no argument', () => {
    it('should return directory of this test', async () => {
      const expected = path.resolve(firostRoot, './lib/__tests__');
      const actual = dirname();
      expect(actual).toEqual(expected);

      // We'll also check that the directory contains this file
      const hasThisFile = await exists(path.resolve(actual, './dirname.js'));
      expect(hasThisFile).toBe(true);
    });
  });
  describe('with an argument', () => {
    it('should act as path.dirname', async () => {
      const actual = dirname('/path/to/a/file.js');
      expect(actual).toEqual('/path/to/a');
    });
  });
});

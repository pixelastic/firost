import path from 'path';
import current from '../index.js';
import readJson from '../../readJson.js';
import writeJson from '../../writeJson.js';
import tmpDirectory from '../../tmpDirectory.js';

describe('packageRoot', () => {
  describe('with no argument', () => {
    it('should return the packageRoot from userland', async () => {
      const actual = current();
      const packageJson = await readJson(path.resolve(actual, 'package.json'));
      expect(packageJson.name).not.toEqual('firost');
    });
  });
  describe('with a reference', () => {
    it('as a directory', async () => {
      const packageRoot = tmpDirectory('firost/packageRoot');
      await writeJson(
        { name: 'test-package' },
        path.resolve(packageRoot, 'package.json'),
      );

      const actual = current(path.resolve(packageRoot, 'some/sub/directory'));
      const packageJson = await readJson(path.resolve(actual, 'package.json'));
      expect(packageJson).toHaveProperty('name', 'test-package');
    });
    it('as a file', async () => {
      const packageRoot = tmpDirectory('firost/packageRoot');
      await writeJson(
        { name: 'test-package' },
        path.resolve(packageRoot, 'package.json'),
      );

      const actual = current(
        path.resolve(packageRoot, 'some/sub/directory/somefile.png'),
      );
      const packageJson = await readJson(path.resolve(actual, 'package.json'));
      expect(packageJson).toHaveProperty('name', 'test-package');
    });
  });
});

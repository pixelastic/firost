import path from 'node:path';
import { packageRoot } from '../index.js';
import { readJson } from '../../readJson.js';
import { writeJson } from '../../writeJson.js';
import { tmpDirectory } from '../../tmpDirectory.js';

describe('packageRoot', () => {
  describe('with no argument', () => {
    it('should return the packageRoot from userland', async () => {
      const actual = packageRoot();
      const packageJson = await readJson(path.resolve(actual, 'package.json'));
      expect(packageJson.name).not.toEqual('firost');
    });
  });
  describe('with a reference', () => {
    it('as a directory', async () => {
      const packageRootPath = tmpDirectory('firost/packageRoot');
      await writeJson(
        { name: 'test-package' },
        path.resolve(packageRootPath, 'package.json'),
      );

      const actual = packageRoot(
        path.resolve(packageRootPath, 'some/sub/directory'),
      );
      const packageJson = await readJson(path.resolve(actual, 'package.json'));
      expect(packageJson).toHaveProperty('name', 'test-package');
    });
    it('as a file', async () => {
      const packageRootPath = tmpDirectory('firost/packageRoot');
      await writeJson(
        { name: 'test-package' },
        path.resolve(packageRootPath, 'package.json'),
      );

      const actual = packageRoot(
        path.resolve(packageRootPath, 'some/sub/directory/somefile.png'),
      );
      const packageJson = await readJson(path.resolve(actual, 'package.json'));
      expect(packageJson).toHaveProperty('name', 'test-package');
    });
  });
});

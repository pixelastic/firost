import path from 'path';
import current from '../index.js';
import readJson from '../../readJson.js';
import writeJson from '../../writeJson.js';
import tmpDirectory from '../../tmpDirectory.js';

describe('packageRoot', () => {
  it('should return the current package root folder', async () => {
    const actual = current();
    const packageJson = await readJson(path.resolve(actual, 'package.json'));
    expect(packageJson).toHaveProperty('name', 'firost');
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

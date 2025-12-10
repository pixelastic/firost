import { packageRoot } from '../index.js';
import { absolute } from '../../absolute.js';
import { dirname } from '../../dirname.js';
import { remove } from '../../remove.js';
import { readJson } from '../../readJson.js';
import { newFile } from '../../newFile/index.js';
import { tmpDirectory } from '../../tmpDirectory.js';
import { runInUserland } from '../../test-helpers/runInUserland.js';

describe('packageRoot', () => {
  const testDirectory = tmpDirectory('firost/packageRoot');
  afterEach(async () => {
    await remove(testDirectory);
  });
  describe('with no argument', () => {
    it('should return the packageRoot from userland', async () => {
      // Given
      const packageJsonPath = absolute(testDirectory, 'package.json');
      await newFile(packageJsonPath);

      // When
      const userlandFile = absolute(testDirectory, 'lib/app.js');
      const actual = await runInUserland('return packageRoot()', userlandFile);

      expect(actual).toEqual(testDirectory);
    });
  });

  describe('from a reference', () => {
    describe('as a file', () => {
      it('next to package.json', async () => {
        // Given
        const packageJsonPath = absolute(testDirectory, 'package.json');
        await newFile(packageJsonPath);

        // When
        const referencePath = absolute(testDirectory, 'my-file.js');

        // Then
        const actual = packageRoot(referencePath);
        expect(actual).toEqual(testDirectory);
      });
      it('in a subdir below package.json', async () => {
        // Given
        const packageJsonPath = absolute(testDirectory, 'package.json');
        await newFile(packageJsonPath);

        // When
        const referencePath = absolute(
          testDirectory,
          'src/something/else/my-file.js',
        );

        // Then
        const actual = packageRoot(referencePath);
        expect(actual).toEqual(testDirectory);
      });
    });
    describe('as a directory', () => {
      it('the same directory as the package root', async () => {
        // Given
        const packageJsonPath = absolute(testDirectory, 'package.json');
        await newFile(packageJsonPath);

        // When
        const referencePath = testDirectory;

        // Then
        const actual = packageRoot(referencePath);
        expect(actual).toEqual(testDirectory);
      });
      it('below package.json', async () => {
        // Given
        const packageJsonPath = absolute(testDirectory, 'package.json');
        await newFile(packageJsonPath);

        // When
        const referencePath = absolute(testDirectory, 'src/something/else');

        // Then
        const actual = packageRoot(referencePath);
        expect(actual).toEqual(testDirectory);
      });
    });
    describe('from inside firost', () => {
      it('should read this package.json', async () => {
        const actual = packageRoot(dirname());
        const packageJson = await readJson(absolute(actual, 'package.json'));
        expect(packageJson.name).toEqual('firost');
      });
    });
    describe('edge cases', () => {
      it('not in a module', async () => {
        // Given

        // When
        const referencePath = absolute(testDirectory, 'my-file.js');

        // Then
        const actual = packageRoot(referencePath);
        expect(actual).toEqual(null);
      });
      it('with several layers of package.json', async () => {
        // Given
        const packageJsonPath = absolute(testDirectory, 'package.json');
        await newFile(packageJsonPath);
        const libRoot = absolute(testDirectory, 'lib');
        const packageJsonPathLib = absolute(libRoot, 'package.json');
        await newFile(packageJsonPathLib);

        // When
        const referencePath = absolute(testDirectory, 'lib/helpers/my-file.js');

        // Then
        const actual = packageRoot(referencePath);
        expect(actual).toEqual(libRoot);
      });
    });
  });
});

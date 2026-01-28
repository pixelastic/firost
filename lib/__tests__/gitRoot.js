import { absolute } from '../absolute.js';
import { dirname } from '../dirname.js';
import { gitRoot } from '../gitRoot.js';
import { mkdirp } from '../mkdirp.js';
import { readJson } from '../readJson.js';
import { remove } from '../remove.js';
import { runInUserland } from '../test-helpers/runInUserland.js';
import { tmpDirectory } from '../tmpDirectory.js';

describe('gitRoot', () => {
  const testDirectory = tmpDirectory('firost/gitRoot');
  afterEach(async () => {
    await remove(testDirectory);
  });
  describe('with no argument', () => {
    it('should return the gitRoot from userland', async () => {
      // Given
      const gitDirectoryPath = absolute(testDirectory, '.git');
      await mkdirp(gitDirectoryPath);

      // When
      const actual = await runInUserland(
        dedent`
          const { gitRoot } = await __import('./gitRoot.js');
          return gitRoot()
        `,
        absolute(testDirectory, 'lib/app.js'),
      );

      expect(actual).toEqual(testDirectory);
    });
  });

  describe('from a reference', () => {
    describe('as a file', () => {
      it('in the git root', async () => {
        // Given
        const gitDirectoryPath = absolute(testDirectory, '.git');
        await mkdirp(gitDirectoryPath);

        // When
        const referencePath = absolute(testDirectory, 'my-file.js');

        // Then
        const actual = gitRoot(referencePath);
        expect(actual).toEqual(testDirectory);
      });
      it('in a subdir below the git root', async () => {
        // Given
        const gitDirectoryPath = absolute(testDirectory, '.git');
        await mkdirp(gitDirectoryPath);

        // When
        const referencePath = absolute(
          testDirectory,
          'src/something/else/my-file.js',
        );

        // Then
        const actual = gitRoot(referencePath);
        expect(actual).toEqual(testDirectory);
      });
    });
    describe('as a directory', () => {
      it('the same directory as the git root', async () => {
        // Given
        const gitDirectoryPath = absolute(testDirectory, '.git');
        await mkdirp(gitDirectoryPath);

        // When
        const referencePath = testDirectory;

        // Then
        const actual = gitRoot(referencePath);
        expect(actual).toEqual(testDirectory);
      });
      it('below the git root', async () => {
        // Given
        const gitDirectoryPath = absolute(testDirectory, '.git');
        await mkdirp(gitDirectoryPath);

        // When
        const referencePath = absolute(testDirectory, 'src/something/else');

        // Then
        const actual = gitRoot(referencePath);
        expect(actual).toEqual(testDirectory);
      });
    });
    describe('from inside firost', () => {
      it('should find the mono-repo root', async () => {
        const actual = gitRoot(dirname());
        const packageJson = await readJson(absolute(actual, 'package.json'));
        expect(packageJson.name).toEqual('firost-monorepo');
      });
    });
    describe('edge cases', () => {
      it('not in a git directory', async () => {
        // Given

        // When
        const referencePath = absolute(testDirectory, 'my-file.js');

        // Then
        const actual = gitRoot(referencePath);
        expect(actual).toEqual(null);
      });
      it('with several layers of .git', async () => {
        // Given
        const gitDirectoryPath = absolute(testDirectory, '.git');
        await mkdirp(gitDirectoryPath);

        const submoduleRoot = absolute(testDirectory, 'submodule');
        const submoduleGitDirectoryPath = absolute(submoduleRoot, '.git');
        await mkdirp(submoduleGitDirectoryPath);

        // When
        const referencePath = absolute(
          testDirectory,
          'submodule/helpers/my-file.js',
        );

        // Then
        const actual = gitRoot(referencePath);
        expect(actual).toEqual(submoduleRoot);
      });
    });
  });
});

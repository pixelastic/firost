import { absolute } from '../absolute.js';
import { copy } from '../copy.js';
import { isFile } from '../isFile.js';
import { isSymlink } from '../isSymlink.js';
import { mkdirp } from '../mkdirp.js';
import { read } from '../read.js';
import { remove } from '../remove.js';
import { symlink } from '../symlink.js';
import { runInUserland } from '../test-helpers/runInUserland.js';
import { tmpDirectory } from '../tmpDirectory.js';
import { write } from '../write.js';

describe('copy', () => {
  const testDirectory = tmpDirectory(`firost/${describeName}`);
  afterEach(async () => {
    await remove(testDirectory);
  });
  describe('with a simple path', () => {
    it('should copy a file to another one', async () => {
      await write('something', `${testDirectory}/foo.txt`);

      await copy(`${testDirectory}/foo.txt`, `${testDirectory}/bar.txt`);

      const actual = await isFile(`${testDirectory}/bar.txt`);
      expect(actual).toBe(true);
    });
    it('should copy a file inside a directory, keeping the same name', async () => {
      await write('something', `${testDirectory}/foo.txt`);
      await mkdirp(`${testDirectory}/folder`);

      await copy(`${testDirectory}/foo.txt`, `${testDirectory}/folder`);

      const actual = await isFile(`${testDirectory}/folder/foo.txt`);
      expect(actual).toBe(true);
    });
    it('should copy a directory inside a directory, recursively', async () => {
      await write('something', `${testDirectory}/one/two/three/foo.txt`);
      await mkdirp(`${testDirectory}/folder`);

      await copy(`${testDirectory}/one`, `${testDirectory}/folder`);

      const actual = await isFile(
        `${testDirectory}/folder/one/two/three/foo.txt`,
      );
      expect(actual).toBe(true);
    });
    it('should overwrite the destination file if it exists', async () => {
      await write('foo', `${testDirectory}/foo.txt`);
      await write('bar', `${testDirectory}/bar.txt`);

      await copy(`${testDirectory}/foo.txt`, `${testDirectory}/baz.txt`);
      await copy(`${testDirectory}/bar.txt`, `${testDirectory}/baz.txt`);

      const actual = await read(`${testDirectory}/baz.txt`);
      expect(actual).toBe('bar');
    });
    it('should reject if trying to copy a file that does not exist', async () => {
      let actual;

      try {
        await copy(`${testDirectory}/nope.txt`, `${testDirectory}.bar.txt`);
      } catch (error) {
        actual = error;
      }

      expect(actual).toHaveProperty('code', 'ENOENT');
    });
    it('should reject if trying to copy a directory to a file', async () => {
      await write('something', `${testDirectory}/foo.txt`);
      await mkdirp(`${testDirectory}/folder`);

      let actual;
      try {
        await copy(`${testDirectory}/folder`, `${testDirectory}/foo.txt`);
      } catch (error) {
        actual = error;
      }

      expect(actual).toHaveProperty(
        'code',
        'ERROR_CANNOT_OVERWRITE_FILE_WITH_DIRECTORY',
      );
    });
    it('should create nested directories if they do not exist', async () => {
      await write('something', `${testDirectory}/foo.txt`);

      await copy(
        `${testDirectory}/foo.txt`,
        `${testDirectory}/one/two/three/foo.txt`,
      );

      const actual = await isFile(`${testDirectory}/one/two/three/foo.txt`);
      expect(actual).toBe(true);
    });
    describe('symlinks', () => {
      const realFilePath = `${testDirectory}/src/subdir/file.txt`;
      const linkFilePath = `${testDirectory}/src/link.txt`;
      beforeEach(async () => {
        await write('something', realFilePath);
        await symlink(linkFilePath, './subdir/file.txt');
      });
      it('should copy them by default', async () => {
        const outputPath = `${testDirectory}/dist/output.txt`;
        await copy(linkFilePath, outputPath);

        expect(await isSymlink(outputPath)).toBe(true);
      });
      it('should resolve them with resolveSymlinks: true', async () => {
        const outputPath = `${testDirectory}/dist/output.txt`;
        await copy(linkFilePath, outputPath, { resolveSymlinks: true });

        expect(await isSymlink(outputPath)).toBe(false);

        const actual = await read(outputPath);
        expect(actual).toBe('something');
      });
      it('should allow copying broken symlinks', async () => {
        await remove(realFilePath);
        const outputPath = `${testDirectory}/dist/output.txt`;
        await copy(linkFilePath, outputPath);

        expect(await isSymlink(outputPath)).toBe(true);
      });
      it('should allow overwrite when copying a symlink over a symlink', async () => {
        const outputPath = `${testDirectory}/dist/output.txt`;
        await copy(linkFilePath, outputPath);
        // Copy over itself
        await copy(linkFilePath, outputPath);

        expect(await isSymlink(outputPath)).toBe(true);
      });
      it('should allow overwrite when copying a symlink over a file', async () => {
        const outputPath = `${testDirectory}/dist/output.txt`;
        await copy(realFilePath, outputPath);
        await copy(linkFilePath, outputPath);

        expect(await isSymlink(outputPath)).toBe(true);
      });
    });
  });
  describe('with an array of files', () => {
    describe('one file', () => {
      it('should do a regular copy', async () => {
        await write('something', `${testDirectory}/foo.txt`);
        await mkdirp(`${testDirectory}/folder`);

        await copy([`${testDirectory}/foo.txt`], `${testDirectory}/folder`);

        const actual = await isFile(`${testDirectory}/folder/foo.txt`);
        expect(actual).toBe(true);
      });
    });
    describe('several files', () => {
      it('should reject if target is an existing file', async () => {
        await write('something', `${testDirectory}/foo.txt`);
        await write('something', `${testDirectory}/bar.txt`);

        let actual;
        try {
          await copy(
            [`${testDirectory}/foo.txt`, `${testDirectory}/bar.txt`],
            `${testDirectory}/foo.txt`,
          );
        } catch (error) {
          actual = error;
        }

        expect(actual).toHaveProperty(
          'code',
          'ERROR_SAME_FILE_DESTINATION_FOR_SEVERAL_FILES',
        );
      });
      it('should copy all matches to target directory', async () => {
        await write('something', `${testDirectory}/foo.txt`);
        await write('something', `${testDirectory}/bar.txt`);
        await mkdirp(`${testDirectory}/folder`);

        await copy(
          [`${testDirectory}/foo.txt`, `${testDirectory}/bar.txt`],
          `${testDirectory}/folder`,
        );

        expect(await isFile(`${testDirectory}/folder/foo.txt`)).toBe(true);
        expect(await isFile(`${testDirectory}/folder/bar.txt`)).toBe(true);
      });
      it('should create target directory if does not exist', async () => {
        await write('something', `${testDirectory}/foo.txt`);
        await write('something', `${testDirectory}/bar.txt`);

        await copy(
          [`${testDirectory}/foo.txt`, `${testDirectory}/bar.txt`],
          `${testDirectory}/folder`,
        );

        expect(await isFile(`${testDirectory}/folder/foo.txt`)).toBe(true);
        expect(await isFile(`${testDirectory}/folder/bar.txt`)).toBe(true);
      });
      it('should copy files and folders recursively', async () => {
        await write('something', `${testDirectory}/one/foo.txt`);
        await write('something', `${testDirectory}/two/bar.txt`);

        await copy(
          [`${testDirectory}/one`, `${testDirectory}/two`],
          `${testDirectory}/folder`,
        );

        expect(await isFile(`${testDirectory}/folder/one/foo.txt`)).toBe(true);
        expect(await isFile(`${testDirectory}/folder/two/bar.txt`)).toBe(true);
      });
    });
  });
  describe('with a glob pattern', () => {
    describe('no matches', () => {
      it('should reject', async () => {
        await mkdirp(`${testDirectory}/folder`);

        let actual;
        try {
          await copy(`${testDirectory}/nope.*`, `${testDirectory}/folder`);
        } catch (error) {
          actual = error;
        }

        expect(actual).toHaveProperty(
          'code',
          'FIROST_COPY_OR_MOVE_GLOB_NO_MATCHES',
        );
      });
    });
    describe('one match', () => {
      it('should do a regular copy', async () => {
        await write('something', `${testDirectory}/foo.txt`);
        await mkdirp(`${testDirectory}/folder`);

        await copy(`${testDirectory}/f*.txt`, `${testDirectory}/folder`);

        const actual = await isFile(`${testDirectory}/folder/foo.txt`);
        expect(actual).toBe(true);
      });
    });
    describe('several matches', () => {
      it('should reject if target is an existing file', async () => {
        await write('something', `${testDirectory}/foo.txt`);
        await write('something', `${testDirectory}/bar.txt`);
        await write('something', `${testDirectory}/baz.txt`);

        let actual;
        try {
          await copy(`${testDirectory}/b*.txt`, `${testDirectory}/foo.txt`);
        } catch (error) {
          actual = error;
        }

        expect(actual).toHaveProperty(
          'code',
          'ERROR_SAME_FILE_DESTINATION_FOR_SEVERAL_FILES',
        );
      });
      it('should copy all matches to target directory', async () => {
        await write('something', `${testDirectory}/foo.txt`);
        await write('something', `${testDirectory}/bar.txt`);
        await write('something', `${testDirectory}/baz.txt`);
        await mkdirp(`${testDirectory}/folder`);

        await copy(`${testDirectory}/b*.txt`, `${testDirectory}/folder`);

        expect(await isFile(`${testDirectory}/folder/bar.txt`)).toBe(true);
        expect(await isFile(`${testDirectory}/folder/baz.txt`)).toBe(true);
      });
      it('should create target directory if does not exist', async () => {
        await write('something', `${testDirectory}/foo.txt`);
        await write('something', `${testDirectory}/bar.txt`);
        await write('something', `${testDirectory}/baz.txt`);

        await copy(`${testDirectory}/b*.txt`, `${testDirectory}/folder`);

        expect(await isFile(`${testDirectory}/folder/bar.txt`)).toBe(true);
        expect(await isFile(`${testDirectory}/folder/baz.txt`)).toBe(true);
      });
      it('should copy files and folders recursively', async () => {
        await write('something', `${testDirectory}/foo/one/two/foo.txt`);
        await write('something', `${testDirectory}/bar/one/two/bar.txt`);
        await write('something', `${testDirectory}/baz/one/two/baz.txt`);

        await copy(`${testDirectory}/b*`, `${testDirectory}/folder`);

        expect(
          await isFile(`${testDirectory}/folder/bar/one/two/bar.txt`),
        ).toBe(true);
        expect(
          await isFile(`${testDirectory}/folder/baz/one/two/baz.txt`),
        ).toBe(true);
      });
    });
  });
  it('with relative paths', async () => {
    await write('something', `${testDirectory}/lib/source.txt`);

    await runInUserland(
      dedent`
        const { copy } = await __import('./copy.js');
        return await copy('./source.txt', './target.txt');
      `,
      absolute(testDirectory, 'lib/app.js'),
    );

    const actual = await read(`${testDirectory}/lib/target.txt`);
    expect(actual).toEqual('something');
  });
});

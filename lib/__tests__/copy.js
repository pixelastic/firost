import { absolute } from '../absolute.js';
import { copy } from '../copy.js';
import { isFile } from '../isFile.js';
import { remove } from '../remove.js';
import { mkdirp } from '../mkdirp.js';
import { read } from '../read.js';
import { write } from '../write.js';
import { emptyDir } from '../emptyDir.js';
import { symlink } from '../symlink.js';
import { isSymlink } from '../isSymlink.js';
import { firostRoot } from '../test-helpers/firostRoot.js';

describe('copy', () => {
  const tmpDir = absolute(firostRoot, '/tmp/copy');
  beforeEach(async () => {
    await emptyDir(tmpDir);
  });
  describe('with a simple path', () => {
    it('should copy a file to another one', async () => {
      await write('foo', `${tmpDir}/foo.txt`);

      await copy(`${tmpDir}/foo.txt`, `${tmpDir}/bar.txt`);

      const actual = await isFile(`${tmpDir}/bar.txt`);
      expect(actual).toBe(true);
    });
    it('should copy a file inside a directory, keeping the same name', async () => {
      await write('foo', `${tmpDir}/foo.txt`);
      await mkdirp(`${tmpDir}/folder`);

      await copy(`${tmpDir}/foo.txt`, `${tmpDir}/folder`);

      const actual = await isFile(`${tmpDir}/folder/foo.txt`);
      expect(actual).toBe(true);
    });
    it('should copy a directory inside a directory, recursively', async () => {
      await write('foo', `${tmpDir}/one/two/three/foo.txt`);
      await mkdirp(`${tmpDir}/folder`);

      await copy(`${tmpDir}/one`, `${tmpDir}/folder`);

      const actual = await isFile(`${tmpDir}/folder/one/two/three/foo.txt`);
      expect(actual).toBe(true);
    });
    it('should overwrite the destination file if it exists', async () => {
      await write('foo', `${tmpDir}/foo.txt`);
      await write('bar', `${tmpDir}/bar.txt`);

      await copy(`${tmpDir}/foo.txt`, `${tmpDir}/baz.txt`);
      await copy(`${tmpDir}/bar.txt`, `${tmpDir}/baz.txt`);

      const actual = await read(`${tmpDir}/baz.txt`);
      expect(actual).toBe('bar');
    });
    it('should reject if trying to copy a file that does not exist', async () => {
      let actual;

      try {
        await copy(`${tmpDir}/nope.txt`, `${tmpDir}.bar.txt`);
      } catch (error) {
        actual = error;
      }

      expect(actual).toHaveProperty('code', 'ENOENT');
    });
    it('should reject if trying to copy a directory to a file', async () => {
      await write('foo', `${tmpDir}/foo.txt`);
      await mkdirp(`${tmpDir}/folder`);

      let actual;
      try {
        await copy(`${tmpDir}/folder`, `${tmpDir}/foo.txt`);
      } catch (error) {
        actual = error;
      }

      expect(actual).toHaveProperty(
        'code',
        'ERROR_CANNOT_OVERWRITE_FILE_WITH_DIRECTORY',
      );
    });
    it('should create nested directories if they do not exist', async () => {
      await write('foo', `${tmpDir}/foo.txt`);

      await copy(`${tmpDir}/foo.txt`, `${tmpDir}/one/two/three/foo.txt`);

      const actual = await isFile(`${tmpDir}/one/two/three/foo.txt`);
      expect(actual).toBe(true);
    });
    describe('symlinks', () => {
      const realFilePath = `${tmpDir}/src/subdir/file.txt`;
      const linkFilePath = `${tmpDir}/src/link.txt`;
      beforeEach(async () => {
        await write('real file', realFilePath);
        await symlink(linkFilePath, './subdir/file.txt');
      });
      it('should copy them by default', async () => {
        const outputPath = `${tmpDir}/dist/output.txt`;
        await copy(linkFilePath, outputPath);

        expect(await isSymlink(outputPath)).toBe(true);
      });
      it('should resolve them with resolveSymlinks: true', async () => {
        const outputPath = `${tmpDir}/dist/output.txt`;
        await copy(linkFilePath, outputPath, { resolveSymlinks: true });

        expect(await isSymlink(outputPath)).toBe(false);

        const actual = await read(outputPath);
        expect(actual).toBe('real file');
      });
      it('should allow copying broken symlinks', async () => {
        await remove(realFilePath);
        const outputPath = `${tmpDir}/dist/output.txt`;
        await copy(linkFilePath, outputPath);

        expect(await isSymlink(outputPath)).toBe(true);
      });
      it('should allow overwrite when copying a symlink over a symlink', async () => {
        const outputPath = `${tmpDir}/dist/output.txt`;
        await copy(linkFilePath, outputPath);
        // Copy over itself
        await copy(linkFilePath, outputPath);

        expect(await isSymlink(outputPath)).toBe(true);
      });
      it('should allow overwrite when copying a symlink over a file', async () => {
        const outputPath = `${tmpDir}/dist/output.txt`;
        await copy(realFilePath, outputPath);
        await copy(linkFilePath, outputPath);

        expect(await isSymlink(outputPath)).toBe(true);
      });
    });
  });
  describe('with a glob pattern', () => {
    describe('no matches', () => {
      it('should reject', async () => {
        await mkdirp(`${tmpDir}/folder`);

        let actual;
        try {
          // Trying to copy several files to one
          await copy(`${tmpDir}/nope.*`, `${tmpDir}/folder`);
        } catch (error) {
          actual = error;
        }

        expect(actual).toHaveProperty('code', 'ERROR_GLOB_NO_MATCHES');
      });
    });
    describe('one match', () => {
      it('should do a regular copy', async () => {
        await write('foo', `${tmpDir}/foo.txt`);
        await mkdirp(`${tmpDir}/folder`);

        await copy(`${tmpDir}/f*.txt`, `${tmpDir}/folder`);

        const actual = await isFile(`${tmpDir}/folder/foo.txt`);
        expect(actual).toBe(true);
      });
    });
    describe('several matches', () => {
      it('should reject if target is an existing file', async () => {
        await write('foo', `${tmpDir}/foo.txt`);
        await write('bar', `${tmpDir}/bar.txt`);
        await write('baz', `${tmpDir}/baz.txt`);

        let actual;
        try {
          await copy(`${tmpDir}/b*.txt`, `${tmpDir}/foo.txt`);
        } catch (error) {
          actual = error;
        }

        expect(actual).toHaveProperty(
          'code',
          'ERROR_SAME_FILE_DESTINATION_FOR_SEVERAL_FILES',
        );
      });
      it('should copy all matches to target directory', async () => {
        await write('foo', `${tmpDir}/foo.txt`);
        await write('bar', `${tmpDir}/bar.txt`);
        await write('baz', `${tmpDir}/baz.txt`);
        await mkdirp(`${tmpDir}/folder`);

        await copy(`${tmpDir}/b*.txt`, `${tmpDir}/folder`);

        expect(await isFile(`${tmpDir}/folder/bar.txt`)).toBe(true);
        expect(await isFile(`${tmpDir}/folder/baz.txt`)).toBe(true);
      });
      it('should create target directory if does not exist', async () => {
        await write('foo', `${tmpDir}/foo.txt`);
        await write('bar', `${tmpDir}/bar.txt`);
        await write('baz', `${tmpDir}/baz.txt`);

        await copy(`${tmpDir}/b*.txt`, `${tmpDir}/folder`);

        expect(await isFile(`${tmpDir}/folder/bar.txt`)).toBe(true);
        expect(await isFile(`${tmpDir}/folder/baz.txt`)).toBe(true);
      });
      it('should copy files and folders recursively', async () => {
        await write('foo', `${tmpDir}/foo/one/two/foo.txt`);
        await write('bar', `${tmpDir}/bar/one/two/bar.txt`);
        await write('baz', `${tmpDir}/baz/one/two/baz.txt`);

        await copy(`${tmpDir}/b*`, `${tmpDir}/folder`);

        expect(await isFile(`${tmpDir}/folder/bar/one/two/bar.txt`)).toBe(true);
        expect(await isFile(`${tmpDir}/folder/baz/one/two/baz.txt`)).toBe(true);
      });
    });
  });
  describe('with an array of files', () => {
    describe('one file', () => {
      it('should do a regular copy', async () => {
        await write('foo', `${tmpDir}/foo.txt`);
        await mkdirp(`${tmpDir}/folder`);

        await copy([`${tmpDir}/foo.txt`], `${tmpDir}/folder`);

        const actual = await isFile(`${tmpDir}/folder/foo.txt`);
        expect(actual).toBe(true);
      });
    });
    describe('several files', () => {
      it('should reject if target is an existing file', async () => {
        await write('foo', `${tmpDir}/foo.txt`);
        await write('bar', `${tmpDir}/bar.txt`);

        let actual;
        try {
          await copy(
            [`${tmpDir}/foo.txt`, `${tmpDir}/bar.txt`],
            `${tmpDir}/foo.txt`,
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
        await write('foo', `${tmpDir}/foo.txt`);
        await write('bar', `${tmpDir}/bar.txt`);
        await mkdirp(`${tmpDir}/folder`);

        await copy(
          [`${tmpDir}/foo.txt`, `${tmpDir}/bar.txt`],
          `${tmpDir}/folder`,
        );

        expect(await isFile(`${tmpDir}/folder/foo.txt`)).toBe(true);
        expect(await isFile(`${tmpDir}/folder/bar.txt`)).toBe(true);
      });
      it('should create target directory if does not exist', async () => {
        await write('foo', `${tmpDir}/foo.txt`);
        await write('bar', `${tmpDir}/bar.txt`);

        await copy(
          [`${tmpDir}/foo.txt`, `${tmpDir}/bar.txt`],
          `${tmpDir}/folder`,
        );

        expect(await isFile(`${tmpDir}/folder/foo.txt`)).toBe(true);
        expect(await isFile(`${tmpDir}/folder/bar.txt`)).toBe(true);
      });
      it('should copy files and folders recursively', async () => {
        await write('foo', `${tmpDir}/one/foo.txt`);
        await write('bar', `${tmpDir}/two/bar.txt`);

        await copy([`${tmpDir}/one`, `${tmpDir}/two`], `${tmpDir}/folder`);

        expect(await isFile(`${tmpDir}/folder/one/foo.txt`)).toBe(true);
        expect(await isFile(`${tmpDir}/folder/two/bar.txt`)).toBe(true);
      });
    });
  });
});

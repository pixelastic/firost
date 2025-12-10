import { absolute } from '../absolute.js';
import { emptyDir } from '../emptyDir.js';
import { firostRoot } from '../test-helpers/firostRoot.js';
import { glob } from '../glob.js';
import { isFile } from '../isFile.js';
import { mkdirp } from '../mkdirp.js';
import { move } from '../move.js';
import { newFile } from '../newFile/index.js';
import { read } from '../read.js';
import { remove } from '../remove.js';
import { runInUserland } from '../test-helpers/runInUserland.js';
import { tmpDirectory } from '../tmpDirectory.js';
import { write } from '../write.js';

describe('move', () => {
  const tmpDir = absolute(firostRoot, '/tmp/move');
  beforeEach(async () => {
    await emptyDir(tmpDir);
  });
  describe('with a simple path', () => {
    it('should move a file to another one', async () => {
      await write('foo', `${tmpDir}/foo.txt`);

      await move(`${tmpDir}/foo.txt`, `${tmpDir}/bar.txt`);

      const actual = await isFile(`${tmpDir}/bar.txt`);
      expect(actual).toBe(true);
    });
    it('should move a file inside a directory, keeping the same name', async () => {
      await write('foo', `${tmpDir}/foo.txt`);
      await mkdirp(`${tmpDir}/folder`);

      await move(`${tmpDir}/foo.txt`, `${tmpDir}/folder`);

      const actual = await isFile(`${tmpDir}/folder/foo.txt`);
      expect(actual).toBe(true);
    });
    it('should move a directory inside a directory, recursively', async () => {
      await write('foo', `${tmpDir}/one/foo.txt`);
      await mkdirp(`${tmpDir}/two`);

      await move(`${tmpDir}/one`, `${tmpDir}/two`);

      const actual = await isFile(`${tmpDir}/two/one/foo.txt`);
      expect(actual).toBe(true);
    });
    it('should overwrite the destination file if it exists', async () => {
      await write('foo', `${tmpDir}/foo.txt`);
      await write('bar', `${tmpDir}/bar.txt`);

      await move(`${tmpDir}/foo.txt`, `${tmpDir}/bar.txt`);

      const actual = await read(`${tmpDir}/bar.txt`);
      expect(actual).toBe('foo');
    });
    it('should reject if trying to move a file that does not exist', async () => {
      let actual;

      try {
        await move(`${tmpDir}/foo.txt`, `${tmpDir}/bar.txt`);
      } catch (error) {
        actual = error;
      }

      expect(actual).toHaveProperty('code', 'ENOENT');
    });
    it('should reject if trying to move a directory to a file', async () => {
      await write('foo', `${tmpDir}/foo.txt`);
      await mkdirp(`${tmpDir}/folder`);

      let actual;

      try {
        await move(`${tmpDir}/folder`, `${tmpDir}/foo.txt`);
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

      await move(`${tmpDir}/foo.txt`, `${tmpDir}/one/two/bar.txt`);

      const actual = await isFile(`${tmpDir}/one/two/bar.txt`);
      expect(actual).toBe(true);
    });
  });
  describe('with a glob pattern', () => {
    describe('no matches', () => {
      it('should reject', async () => {
        await mkdirp(`${tmpDir}/folder`);

        let actual;
        try {
          // Trying to move several files to one
          await move(`${tmpDir}/nope.*`, `${tmpDir}/folder`);
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
      it('should do a regular move', async () => {
        await write('foo', `${tmpDir}/foo.txt`);
        await mkdirp(`${tmpDir}/folder`);

        await move(`${tmpDir}/*.txt`, `${tmpDir}/folder`);

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
          await move(`${tmpDir}/b*.txt`, `${tmpDir}/foo.txt`);
        } catch (error) {
          actual = error;
        }

        expect(actual).toHaveProperty(
          'code',
          'ERROR_SAME_FILE_DESTINATION_FOR_SEVERAL_FILES',
        );
      });
      it('should move all matches to target directory', async () => {
        await write('foo', `${tmpDir}/foo.txt`);
        await write('bar', `${tmpDir}/bar.txt`);
        await write('baz', `${tmpDir}/baz.txt`);
        await mkdirp(`${tmpDir}/folder`);

        await move(`${tmpDir}/b*.txt`, `${tmpDir}/folder`);

        expect(await isFile(`${tmpDir}/folder/bar.txt`)).toBe(true);
        expect(await isFile(`${tmpDir}/folder/baz.txt`)).toBe(true);
      });
      it('should create target directory if does not exist', async () => {
        await write('foo', `${tmpDir}/foo.txt`);
        await write('bar', `${tmpDir}/bar.txt`);
        await write('baz', `${tmpDir}/baz.txt`);

        await move(`${tmpDir}/b*.txt`, `${tmpDir}/folder`);

        expect(await isFile(`${tmpDir}/folder/bar.txt`)).toBe(true);
        expect(await isFile(`${tmpDir}/folder/baz.txt`)).toBe(true);
      });
    });
  });
  describe('with an array of files', () => {
    describe('one file', () => {
      it('should do a regular copy', async () => {
        await write('foo', `${tmpDir}/foo.txt`);
        await mkdirp(`${tmpDir}/folder`);

        await move([`${tmpDir}/foo.txt`], `${tmpDir}/folder`);

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
          await move(
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

        await move(
          [`${tmpDir}/foo.txt`, `${tmpDir}/bar.txt`],
          `${tmpDir}/folder`,
        );

        expect(await isFile(`${tmpDir}/folder/foo.txt`)).toBe(true);
        expect(await isFile(`${tmpDir}/folder/bar.txt`)).toBe(true);
      });
      it('should create target directory if does not exist', async () => {
        await write('foo', `${tmpDir}/foo.txt`);
        await write('bar', `${tmpDir}/bar.txt`);

        await move(
          [`${tmpDir}/foo.txt`, `${tmpDir}/bar.txt`],
          `${tmpDir}/folder`,
        );

        expect(await isFile(`${tmpDir}/folder/foo.txt`)).toBe(true);
        expect(await isFile(`${tmpDir}/folder/bar.txt`)).toBe(true);
      });
      it('should copy files and folders recursively', async () => {
        await write('foo', `${tmpDir}/one/foo.txt`);
        await write('bar', `${tmpDir}/two/bar.txt`);

        await move([`${tmpDir}/one`, `${tmpDir}/two`], `${tmpDir}/folder`);

        expect(await isFile(`${tmpDir}/folder/one/foo.txt`)).toBe(true);
        expect(await isFile(`${tmpDir}/folder/two/bar.txt`)).toBe(true);
      });
    });
  });
  it('with <placeholders>', async () => {
    // Given
    const userlandTmpDir = tmpDirectory('firost/move');
    await mkdirp(absolute(userlandTmpDir, '.git'));
    await mkdirp(absolute(userlandTmpDir, 'dist'));
    await newFile(absolute(userlandTmpDir, 'src/one.txt'));
    await newFile(absolute(userlandTmpDir, 'src/two.txt'));
    await newFile(absolute(userlandTmpDir, 'src/deux.txt'));
    await newFile(absolute(userlandTmpDir, 'src/three/three.txt'));
    await newFile(absolute(userlandTmpDir, 'src/three/trois.txt'));

    // When
    await runInUserland(
      dedent`
          const { move } = await __import('./move.js');
          await move('<gitRoot>/src/one.txt', '<gitRoot>/dist');
          await move(
            ['<gitRoot>/src/two.txt', '<gitRoot>/src/deux.txt'],
            '<gitRoot>/dist'
          );
          await move('<gitRoot>/src/three/*.txt', '<gitRoot>/dist');
        `,
      absolute(userlandTmpDir, 'lib/app.js'),
    );

    // Then
    const actual = await glob('./**/*.txt', {
      cwd: userlandTmpDir,
      absolutePaths: false,
    });
    expect(actual).toEqual([
      'dist/deux.txt',
      'dist/one.txt',
      'dist/three.txt',
      'dist/trois.txt',
      'dist/two.txt',
    ]);
    // Cleanup
    await remove(userlandTmpDir);
  });
});

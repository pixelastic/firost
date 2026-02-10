import { absolute } from '../absolute.js';
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
  const testDirectory = tmpDirectory(`firost/${describeName}`);
  afterEach(async () => {
    await remove(testDirectory);
  });
  describe('with a simple path', () => {
    it('should move a file to another one', async () => {
      await newFile(`${testDirectory}/foo.txt`);

      await move(`${testDirectory}/foo.txt`, `${testDirectory}/bar.txt`);

      const actual = await isFile(`${testDirectory}/bar.txt`);
      expect(actual).toBe(true);
    });
    it('should move a file inside a directory, keeping the same name', async () => {
      await newFile(`${testDirectory}/foo.txt`);
      await mkdirp(`${testDirectory}/folder`);

      await move(`${testDirectory}/foo.txt`, `${testDirectory}/folder`);

      const actual = await isFile(`${testDirectory}/folder/foo.txt`);
      expect(actual).toBe(true);
    });
    it('should move a directory inside a directory, recursively', async () => {
      await newFile(`${testDirectory}/one/foo.txt`);
      await mkdirp(`${testDirectory}/two`);

      await move(`${testDirectory}/one`, `${testDirectory}/two`);

      const actual = await isFile(`${testDirectory}/two/one/foo.txt`);
      expect(actual).toBe(true);
    });
    it('should overwrite the destination file if it exists', async () => {
      await write('foo', `${testDirectory}/foo.txt`);
      await write('bar', `${testDirectory}/bar.txt`);

      await move(`${testDirectory}/foo.txt`, `${testDirectory}/bar.txt`);

      const actual = await read(`${testDirectory}/bar.txt`);
      expect(actual).toBe('foo');
    });
    it('should reject if trying to move a file that does not exist', async () => {
      let actual;

      try {
        await move(`${testDirectory}/foo.txt`, `${testDirectory}/bar.txt`);
      } catch (error) {
        actual = error;
      }

      expect(actual).toHaveProperty('code', 'ENOENT');
    });
    it('should reject if trying to move a directory to a file', async () => {
      await newFile(`${testDirectory}/foo.txt`);
      await mkdirp(`${testDirectory}/folder`);

      let actual;

      try {
        await move(`${testDirectory}/folder`, `${testDirectory}/foo.txt`);
      } catch (error) {
        actual = error;
      }

      expect(actual).toHaveProperty(
        'code',
        'FIROST_MOVE_OVERWRITE_FILE_WITH_DIRECTORY',
      );
    });
    it('should create nested directories if they do not exist', async () => {
      await newFile(`${testDirectory}/foo.txt`);

      await move(
        `${testDirectory}/foo.txt`,
        `${testDirectory}/one/two/bar.txt`,
      );

      const actual = await isFile(`${testDirectory}/one/two/bar.txt`);
      expect(actual).toBe(true);
    });
  });
  describe('with a glob pattern', () => {
    describe('no matches', () => {
      it('should reject', async () => {
        await mkdirp(`${testDirectory}/folder`);

        let actual;
        try {
          await move(`${testDirectory}/nope.*`, `${testDirectory}/folder`);
        } catch (error) {
          actual = error;
        }

        expect(actual).toHaveProperty('code', 'FIROST_MOVE_GLOB_NO_MATCHES');
      });
    });
    describe('one match', () => {
      it('should do a regular move', async () => {
        await newFile(`${testDirectory}/foo.txt`);
        await mkdirp(`${testDirectory}/folder`);

        await move(`${testDirectory}/*.txt`, `${testDirectory}/folder`);

        const actual = await isFile(`${testDirectory}/folder/foo.txt`);
        expect(actual).toBe(true);
      });
    });
    describe('several matches', () => {
      it('should reject if target is an existing file', async () => {
        await newFile(`${testDirectory}/foo.txt`);
        await newFile(`${testDirectory}/bar.txt`);
        await newFile(`${testDirectory}/baz.txt`);

        let actual;
        try {
          await move(`${testDirectory}/b*.txt`, `${testDirectory}/foo.txt`);
        } catch (error) {
          actual = error;
        }

        expect(actual).toHaveProperty(
          'code',
          'FIROST_MOVE_SAME_FILE_DESTINATION_FOR_SEVERAL_FILES',
        );
      });
      it('should move all matches to target directory', async () => {
        await newFile(`${testDirectory}/foo.txt`);
        await newFile(`${testDirectory}/bar.txt`);
        await newFile(`${testDirectory}/baz.txt`);
        await mkdirp(`${testDirectory}/folder`);

        await move(`${testDirectory}/b*.txt`, `${testDirectory}/folder`);

        expect(await isFile(`${testDirectory}/folder/bar.txt`)).toBe(true);
        expect(await isFile(`${testDirectory}/folder/baz.txt`)).toBe(true);
      });
      it('should create target directory if does not exist', async () => {
        await newFile(`${testDirectory}/foo.txt`);
        await newFile(`${testDirectory}/bar.txt`);
        await newFile(`${testDirectory}/baz.txt`);

        await move(`${testDirectory}/b*.txt`, `${testDirectory}/folder`);

        expect(await isFile(`${testDirectory}/folder/bar.txt`)).toBe(true);
        expect(await isFile(`${testDirectory}/folder/baz.txt`)).toBe(true);
      });
    });
  });
  describe('with an array of files', () => {
    describe('one file', () => {
      it('should do a regular copy', async () => {
        await newFile(`${testDirectory}/foo.txt`);
        await mkdirp(`${testDirectory}/folder`);

        await move([`${testDirectory}/foo.txt`], `${testDirectory}/folder`);

        const actual = await isFile(`${testDirectory}/folder/foo.txt`);
        expect(actual).toBe(true);
      });
    });
    describe('several files', () => {
      it('should reject if target is an existing file', async () => {
        await newFile(`${testDirectory}/foo.txt`);
        await newFile(`${testDirectory}/bar.txt`);

        let actual;
        try {
          await move(
            [`${testDirectory}/foo.txt`, `${testDirectory}/bar.txt`],
            `${testDirectory}/foo.txt`,
          );
        } catch (error) {
          actual = error;
        }

        expect(actual).toHaveProperty(
          'code',
          'FIROST_MOVE_SAME_FILE_DESTINATION_FOR_SEVERAL_FILES',
        );
      });
      it('should copy all matches to target directory', async () => {
        await newFile(`${testDirectory}/foo.txt`);
        await newFile(`${testDirectory}/bar.txt`);
        await mkdirp(`${testDirectory}/folder`);

        await move(
          [`${testDirectory}/foo.txt`, `${testDirectory}/bar.txt`],
          `${testDirectory}/folder`,
        );

        expect(await isFile(`${testDirectory}/folder/foo.txt`)).toBe(true);
        expect(await isFile(`${testDirectory}/folder/bar.txt`)).toBe(true);
      });
      it('should create target directory if does not exist', async () => {
        await newFile(`${testDirectory}/foo.txt`);
        await newFile(`${testDirectory}/bar.txt`);

        await move(
          [`${testDirectory}/foo.txt`, `${testDirectory}/bar.txt`],
          `${testDirectory}/folder`,
        );

        expect(await isFile(`${testDirectory}/folder/foo.txt`)).toBe(true);
        expect(await isFile(`${testDirectory}/folder/bar.txt`)).toBe(true);
      });
      it('should copy files and folders recursively', async () => {
        await newFile(`${testDirectory}/one/foo.txt`);
        await newFile(`${testDirectory}/two/bar.txt`);

        await move(
          [`${testDirectory}/one`, `${testDirectory}/two`],
          `${testDirectory}/folder`,
        );

        expect(await isFile(`${testDirectory}/folder/one/foo.txt`)).toBe(true);
        expect(await isFile(`${testDirectory}/folder/two/bar.txt`)).toBe(true);
      });
    });
  });
  it('with relative paths', async () => {
    await write('something', `${testDirectory}/lib/source.txt`);

    await runInUserland(
      dedent`
        const { move } = await __import('./move.js');
        return await move('./source.txt', './target.txt');
      `,
      absolute(testDirectory, 'lib/app.js'),
    );

    const actual = await read(`${testDirectory}/lib/target.txt`);
    expect(actual).toEqual('something');
  });
});

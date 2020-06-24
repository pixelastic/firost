const current = require('../copy');
const isFile = require('../isFile');
const mkdirp = require('../mkdirp');
const read = require('../read');
const write = require('../write');
const emptyDir = require('../emptyDir');

describe('copy', () => {
  const tmpDir = './tmp/copy';
  beforeEach(async () => {
    await emptyDir(tmpDir);
  });
  describe('with a simple path', () => {
    it('should copy a file to another one', async () => {
      await write('foo', `${tmpDir}/foo.txt`);

      await current(`${tmpDir}/foo.txt`, `${tmpDir}/bar.txt`);

      const actual = await isFile(`${tmpDir}/bar.txt`);
      expect(actual).toEqual(true);
    });
    it('should copy a file inside a directory, keeping the same name', async () => {
      await write('foo', `${tmpDir}/foo.txt`);
      await mkdirp(`${tmpDir}/folder`);

      await current(`${tmpDir}/foo.txt`, `${tmpDir}/folder`);

      const actual = await isFile(`${tmpDir}/folder/foo.txt`);
      expect(actual).toEqual(true);
    });
    it('should copy a directory inside a directory, recursively', async () => {
      await write('foo', `${tmpDir}/one/two/three/foo.txt`);
      await mkdirp(`${tmpDir}/folder`);

      await current(`${tmpDir}/one`, `${tmpDir}/folder`);

      const actual = await isFile(`${tmpDir}/folder/one/two/three/foo.txt`);
      expect(actual).toEqual(true);
    });
    it('should overwrite the destination file if it exists', async () => {
      await write('foo', `${tmpDir}/foo.txt`);
      await write('bar', `${tmpDir}/bar.txt`);

      await current(`${tmpDir}/foo.txt`, `${tmpDir}/baz.txt`);
      await current(`${tmpDir}/bar.txt`, `${tmpDir}/baz.txt`);

      const actual = await read(`${tmpDir}/baz.txt`);
      expect(actual).toEqual('bar');
    });
    it('should reject if trying to copy a file that does not exist', async () => {
      let actual;

      try {
        await current(`${tmpDir}/nope.txt`, `${tmpDir}.bar.txt`);
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
        await current(`${tmpDir}/folder`, `${tmpDir}/foo.txt`);
      } catch (error) {
        actual = error;
      }

      expect(actual).toHaveProperty(
        'code',
        'ERROR_CANNOT_OVERWRITE_FILE_WITH_DIRECTORY'
      );
    });
    it('should create nested directories if they do not exist', async () => {
      await write('foo', `${tmpDir}/foo.txt`);

      await current(`${tmpDir}/foo.txt`, `${tmpDir}/one/two/three/foo.txt`);

      const actual = await isFile(`${tmpDir}/one/two/three/foo.txt`);
      expect(actual).toEqual(true);
    });
  });
  describe('with a glob pattern', () => {
    describe('no matches', () => {
      it('should reject', async () => {
        await mkdirp(`${tmpDir}/folder`);

        let actual;
        try {
          // Trying to copy several files to one
          await current(`${tmpDir}/nope.*`, `${tmpDir}/folder`);
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

        await current(`${tmpDir}/f*.txt`, `${tmpDir}/folder`);

        const actual = await isFile(`${tmpDir}/folder/foo.txt`);
        expect(actual).toEqual(true);
      });
    });
    describe('several matches', () => {
      it('should reject if target is an existing file', async () => {
        await write('foo', `${tmpDir}/foo.txt`);
        await write('bar', `${tmpDir}/bar.txt`);
        await write('baz', `${tmpDir}/baz.txt`);

        let actual;
        try {
          await current(`${tmpDir}/b*.txt`, `${tmpDir}/foo.txt`);
        } catch (error) {
          actual = error;
        }

        expect(actual).toHaveProperty(
          'code',
          'ERROR_SAME_FILE_DESTINATION_FOR_SEVERAL_FILES'
        );
      });
      it('should copy all matches to target directory', async () => {
        await write('foo', `${tmpDir}/foo.txt`);
        await write('bar', `${tmpDir}/bar.txt`);
        await write('baz', `${tmpDir}/baz.txt`);
        await mkdirp(`${tmpDir}/folder`);

        await current(`${tmpDir}/b*.txt`, `${tmpDir}/folder`);

        expect(await isFile(`${tmpDir}/folder/bar.txt`)).toEqual(true);
        expect(await isFile(`${tmpDir}/folder/baz.txt`)).toEqual(true);
      });
      it('should create target directory if does not exist', async () => {
        await write('foo', `${tmpDir}/foo.txt`);
        await write('bar', `${tmpDir}/bar.txt`);
        await write('baz', `${tmpDir}/baz.txt`);

        await current(`${tmpDir}/b*.txt`, `${tmpDir}/folder`);

        expect(await isFile(`${tmpDir}/folder/bar.txt`)).toEqual(true);
        expect(await isFile(`${tmpDir}/folder/baz.txt`)).toEqual(true);
      });
      it('should copy files and folders recursively', async () => {
        await write('foo', `${tmpDir}/foo/one/two/foo.txt`);
        await write('bar', `${tmpDir}/bar/one/two/bar.txt`);
        await write('baz', `${tmpDir}/baz/one/two/baz.txt`);

        await current(`${tmpDir}/b*`, `${tmpDir}/folder`);

        expect(await isFile(`${tmpDir}/folder/bar/one/two/bar.txt`)).toEqual(
          true
        );
        expect(await isFile(`${tmpDir}/folder/baz/one/two/baz.txt`)).toEqual(
          true
        );
      });
    });
  });
  describe('with an array of files', () => {
    describe('one file', () => {
      it('should do a regular copy', async () => {
        await write('foo', `${tmpDir}/foo.txt`);
        await mkdirp(`${tmpDir}/folder`);

        await current([`${tmpDir}/foo.txt`], `${tmpDir}/folder`);

        const actual = await isFile(`${tmpDir}/folder/foo.txt`);
        expect(actual).toEqual(true);
      });
    });
    describe('several files', () => {
      it('should reject if target is an existing file', async () => {
        await write('foo', `${tmpDir}/foo.txt`);
        await write('bar', `${tmpDir}/bar.txt`);

        let actual;
        try {
          await current(
            [`${tmpDir}/foo.txt`, `${tmpDir}/bar.txt`],
            `${tmpDir}/foo.txt`
          );
        } catch (error) {
          actual = error;
        }

        expect(actual).toHaveProperty(
          'code',
          'ERROR_SAME_FILE_DESTINATION_FOR_SEVERAL_FILES'
        );
      });
      it('should copy all matches to target directory', async () => {
        await write('foo', `${tmpDir}/foo.txt`);
        await write('bar', `${tmpDir}/bar.txt`);
        await mkdirp(`${tmpDir}/folder`);

        await current(
          [`${tmpDir}/foo.txt`, `${tmpDir}/bar.txt`],
          `${tmpDir}/folder`
        );

        expect(await isFile(`${tmpDir}/folder/foo.txt`)).toEqual(true);
        expect(await isFile(`${tmpDir}/folder/bar.txt`)).toEqual(true);
      });
      it('should create target directory if does not exist', async () => {
        await write('foo', `${tmpDir}/foo.txt`);
        await write('bar', `${tmpDir}/bar.txt`);

        await current(
          [`${tmpDir}/foo.txt`, `${tmpDir}/bar.txt`],
          `${tmpDir}/folder`
        );

        expect(await isFile(`${tmpDir}/folder/foo.txt`)).toEqual(true);
        expect(await isFile(`${tmpDir}/folder/bar.txt`)).toEqual(true);
      });
      it('should copy files and folders recursively', async () => {
        await write('foo', `${tmpDir}/one/foo.txt`);
        await write('bar', `${tmpDir}/two/bar.txt`);

        await current([`${tmpDir}/one`, `${tmpDir}/two`], `${tmpDir}/folder`);

        expect(await isFile(`${tmpDir}/folder/one/foo.txt`)).toEqual(true);
        expect(await isFile(`${tmpDir}/folder/two/bar.txt`)).toEqual(true);
      });
    });
  });
});

const module = require('../move');
const isFile = require('../isFile');
const mkdirp = require('../mkdirp');
const read = require('../read');
const write = require('../write');
const emptyDir = require('../emptyDir');

describe('move', () => {
  const tmpDir = './tmp/move';
  beforeEach(async () => {
    await emptyDir(tmpDir);
  });
  describe('with a simple path', () => {
    it('should move a file to another one', async () => {
      await write('foo', `${tmpDir}/foo.txt`);

      await module(`${tmpDir}/foo.txt`, `${tmpDir}/bar.txt`);

      const actual = await isFile(`${tmpDir}/bar.txt`);
      expect(actual).toEqual(true);
    });
    it('should move a file inside a directory, keeping the same name', async () => {
      await write('foo', `${tmpDir}/foo.txt`);
      await mkdirp(`${tmpDir}/folder`);

      await module(`${tmpDir}/foo.txt`, `${tmpDir}/folder`);

      const actual = await isFile(`${tmpDir}/folder/foo.txt`);
      expect(actual).toEqual(true);
    });
    it('should move a directory inside a directory, recursively', async () => {
      await write('foo', `${tmpDir}/one/foo.txt`);
      await mkdirp(`${tmpDir}/two`);

      await module(`${tmpDir}/one`, `${tmpDir}/two`);

      const actual = await isFile(`${tmpDir}/two/one/foo.txt`);
      expect(actual).toEqual(true);
    });
    it('should overwrite the destination file if it exists', async () => {
      await write('foo', `${tmpDir}/foo.txt`);
      await write('bar', `${tmpDir}/bar.txt`);

      await module(`${tmpDir}/foo.txt`, `${tmpDir}/bar.txt`);

      const actual = await read(`${tmpDir}/bar.txt`);
      expect(actual).toEqual('foo');
    });
    it('should reject if trying to move a file that does not exist', async () => {
      let actual;

      try {
        await module(`${tmpDir}/foo.txt`, `${tmpDir}/bar.txt`);
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
        await module(`${tmpDir}/folder`, `${tmpDir}/foo.txt`);
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

      await module(`${tmpDir}/foo.txt`, `${tmpDir}/one/two/bar.txt`);

      const actual = await isFile(`${tmpDir}/one/two/bar.txt`);
      expect(actual).toEqual(true);
    });
  });
  describe('with a glob pattern', () => {
    describe('no matches', () => {
      it('should reject', async () => {
        await mkdirp(`${tmpDir}/folder`);

        let actual;
        try {
          // Trying to move several files to one
          await module(`${tmpDir}/nope.*`, `${tmpDir}/folder`);
        } catch (error) {
          actual = error;
        }

        expect(actual).toHaveProperty('code', 'ERROR_GLOB_NO_MATCHES');
      });
    });
    describe('one match', () => {
      it('should do a regular move', async () => {
        await write('foo', `${tmpDir}/foo.txt`);
        await mkdirp(`${tmpDir}/folder`);

        await module(`${tmpDir}/*.txt`, `${tmpDir}/folder`);

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
          await module(`${tmpDir}/b*.txt`, `${tmpDir}/foo.txt`);
        } catch (error) {
          actual = error;
        }

        expect(actual).toHaveProperty(
          'code',
          'ERROR_SAME_FILE_DESTINATION_FOR_SEVERAL_FILES'
        );
      });
      it('should move all matches to target directory', async () => {
        await write('foo', `${tmpDir}/foo.txt`);
        await write('bar', `${tmpDir}/bar.txt`);
        await write('baz', `${tmpDir}/baz.txt`);
        await mkdirp(`${tmpDir}/folder`);

        await module(`${tmpDir}/b*.txt`, `${tmpDir}/folder`);

        expect(await isFile(`${tmpDir}/folder/bar.txt`)).toEqual(true);
        expect(await isFile(`${tmpDir}/folder/baz.txt`)).toEqual(true);
      });
      it('should create target directory if does not exist', async () => {
        await write('foo', `${tmpDir}/foo.txt`);
        await write('bar', `${tmpDir}/bar.txt`);
        await write('baz', `${tmpDir}/baz.txt`);

        await module(`${tmpDir}/b*.txt`, `${tmpDir}/folder`);

        expect(await isFile(`${tmpDir}/folder/bar.txt`)).toEqual(true);
        expect(await isFile(`${tmpDir}/folder/baz.txt`)).toEqual(true);
      });
    });
  });
  describe('with an array of files', () => {
    describe('one file', () => {
      it('should do a regular copy', async () => {
        await write('foo', `${tmpDir}/foo.txt`);
        await mkdirp(`${tmpDir}/folder`);

        await module([`${tmpDir}/foo.txt`], `${tmpDir}/folder`);

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
          await module(
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

        await module(
          [`${tmpDir}/foo.txt`, `${tmpDir}/bar.txt`],
          `${tmpDir}/folder`
        );

        expect(await isFile(`${tmpDir}/folder/foo.txt`)).toEqual(true);
        expect(await isFile(`${tmpDir}/folder/bar.txt`)).toEqual(true);
      });
      it('should create target directory if does not exist', async () => {
        await write('foo', `${tmpDir}/foo.txt`);
        await write('bar', `${tmpDir}/bar.txt`);

        await module(
          [`${tmpDir}/foo.txt`, `${tmpDir}/bar.txt`],
          `${tmpDir}/folder`
        );

        expect(await isFile(`${tmpDir}/folder/foo.txt`)).toEqual(true);
        expect(await isFile(`${tmpDir}/folder/bar.txt`)).toEqual(true);
      });
      it('should copy files and folders recursively', async () => {
        await write('foo', `${tmpDir}/one/foo.txt`);
        await write('bar', `${tmpDir}/two/bar.txt`);

        await module([`${tmpDir}/one`, `${tmpDir}/two`], `${tmpDir}/folder`);

        expect(await isFile(`${tmpDir}/folder/one/foo.txt`)).toEqual(true);
        expect(await isFile(`${tmpDir}/folder/two/bar.txt`)).toEqual(true);
      });
    });
  });
});

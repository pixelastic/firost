import module from '../copy';
import helper from '../test-helper';
import isFile from '../isFile';
import isDirectory from '../isDirectory';
import mkdirp from '../mkdirp';
import read from '../read';
const fixturePath = helper.fixturePath();
const tmpPath = helper.tmpPath('copy');

describe('copy', () => {
  beforeEach(async () => {
    await helper.clearTmpDirectory('copy');
  });
  describe('with a simple path', () => {
    it('should copy a file to another one', async () => {
      const source = `${fixturePath}/root.txt`;
      const destination = `${tmpPath}/destination.txt`;
      await module(source, destination);

      const actual = await isFile(destination);
      expect(actual).toEqual(true);
    });
    it('should copy a file inside a directory, keeping the same name', async () => {
      const source = `${fixturePath}/root.txt`;
      const destination = tmpPath;
      await module(source, destination);

      const actual = await isFile(`${tmpPath}/root.txt`);
      expect(actual).toEqual(true);
    });
    it('should copy a directory inside a directory, recursively', async () => {
      const destination = `${tmpPath}/foo`;

      // Create a subdirectory
      await mkdirp(destination);

      await module(`${fixturePath}/first`, destination);

      const actual = await isFile(`${tmpPath}/foo/first/second/second.txt`);
      expect(actual).toEqual(true);
    });
    it('should overwrite the destination file if it exists', async () => {
      // Set one file, then overwrite with another
      await module(`${fixturePath}/root.txt`, tmpPath);
      await module(`${fixturePath}/foo_100`, `${tmpPath}/root.txt`);

      // Check that the content is the content of the second file
      const actual = await read(`${tmpPath}/root.txt`);
      expect(actual).toEqual('foo_100');
    });
    it('should reject if trying to copy a file that does not exist', async () => {
      const source = `${fixturePath}/nope`;
      const destination = tmpPath;
      let actual;

      try {
        await module(source, destination);
      } catch (error) {
        actual = error;
      }

      expect(actual).toHaveProperty('code', 'ENOENT');
    });
    it('should reject if trying to copy a directory to a file', async () => {
      // Create a file
      await module(`${fixturePath}/root.txt`, tmpPath);

      let actual;
      try {
        // Trying to copy a directory to a file
        await module(`${fixturePath}/first`, `${tmpPath}/root.txt`);
      } catch (error) {
        actual = error;
      }

      expect(actual).toHaveProperty(
        'code',
        'ERROR_CANNOT_OVERWRITE_FILE_WITH_DIRECTORY'
      );
    });
    it('should create nested directories if they do not exist', async () => {
      const source = `${fixturePath}/root.txt`;
      const destination = `${tmpPath}/foo/bar/destination.txt`;
      await module(source, destination);

      const actual = await isFile(destination);
      expect(actual).toEqual(true);
    });
  });
  describe('with a glob pattern', () => {
    describe('no matches', () => {
      it('should reject', async () => {
        const source = `${fixturePath}/nope.*`;
        const destination = `${tmpPath}`;

        let actual;
        try {
          // Trying to copy several files to one
          await module(source, destination);
        } catch (error) {
          actual = error;
        }

        expect(actual).toHaveProperty('code', 'ERROR_GLOB_NO_MATCHES');
      });
    });
    describe('one match', () => {
      it('should do a regular copy', async () => {
        const source = `${fixturePath}/f*bar`;
        const destination = `${tmpPath}`;
        jest.spyOn(module, 'applyToOne');

        await module(source, destination);

        expect(module.applyToOne).toHaveBeenCalledWith(
          expect.stringMatching(/foo_bar$/),
          destination
        );
      });
    });
    describe('several matches', () => {
      it('should reject if target is an existing file', async () => {
        const source = `${fixturePath}/root.*`;
        const destination = `${tmpPath}/destination.txt`;

        // Create a file for the destination
        await module(`${fixturePath}/root.txt`, destination);

        let actual;
        try {
          await module(source, destination);
        } catch (error) {
          actual = error;
        }

        expect(actual).toHaveProperty(
          'code',
          'ERROR_SAME_FILE_DESTINATION_FOR_SEVERAL_FILES'
        );
      });
      it('should copy all matches to target directory', async () => {
        const source = `${fixturePath}/root.*`;
        const destination = tmpPath;
        await module(source, destination);

        expect(await isFile(`${tmpPath}/root.txt`)).toEqual(true);
        expect(await isFile(`${tmpPath}/root.gif`)).toEqual(true);
      });
      it('should create target directory if does not exist', async () => {
        const source = `${fixturePath}/root.*`;
        const destination = `${tmpPath}/foo/bar`;
        await module(source, destination);

        expect(await isFile(`${tmpPath}/foo/bar/root.txt`)).toEqual(true);
        expect(await isFile(`${tmpPath}/foo/bar/root.gif`)).toEqual(true);
      });
      it('should copy files and folders recursively', async () => {
        const source = `${fixturePath}/*`;
        const destination = `${tmpPath}/`;
        await module(source, destination);

        expect(await isDirectory(`${tmpPath}/first`)).toEqual(true);
        expect(await isDirectory(`${tmpPath}/first/second`)).toEqual(true);
        expect(await isFile(`${tmpPath}/first/first.txt`)).toEqual(true);
      });
    });
  });
});

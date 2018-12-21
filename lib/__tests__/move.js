import module from '../move';
import helper from '../test-helper';
import isFile from '../isFile';
import mkdirp from '../mkdirp';
import read from '../read';
import copy from '../copy';
const fixturePath = helper.fixturePath();
const tmpPath = helper.tmpPath('move');
const srcPath = `${tmpPath}/src`;
const distPath = `${tmpPath}/dist`;

describe('move', () => {
  beforeEach(async () => {
    await helper.clearTmpDirectory('move');
    await copy(`${fixturePath}`, srcPath);
    await mkdirp(distPath);
  });
  describe('with a simple path', () => {
    it('should move a file to another one', async () => {
      const source = `${srcPath}/root.txt`;
      const destination = `${distPath}/destination.txt`;
      await module(source, destination);

      const actual = await isFile(destination);
      expect(actual).toEqual(true);
    });
    it('should move a file inside a directory, keeping the same name', async () => {
      const source = `${srcPath}/root.txt`;
      const destination = distPath;
      await module(source, destination);

      const actual = await isFile(`${distPath}/root.txt`);
      expect(actual).toEqual(true);
    });
    it('should move a directory inside a directory, recursively', async () => {
      const destination = `${distPath}/foo`;

      // Create a subdirectory
      await mkdirp(destination);

      await module(`${srcPath}/first`, destination);

      const actual = await isFile(`${distPath}/foo/first/second/second.txt`);
      expect(actual).toEqual(true);
    });
    it('should overwrite the destination file if it exists', async () => {
      // Set one file, then overwrite with another
      await copy(`${srcPath}/root.txt`, distPath);
      await module(`${srcPath}/foo_100`, `${distPath}/root.txt`);

      // Check that the content is the content of the second file
      const actual = await read(`${distPath}/root.txt`);
      expect(actual).toEqual('foo_100');
    });
    it('should reject if trying to move a file that does not exist', async () => {
      const source = `${srcPath}/nope`;
      const destination = distPath;
      let actual;

      try {
        await module(source, destination);
      } catch (error) {
        actual = error;
      }

      expect(actual).toHaveProperty('code', 'ENOENT');
    });
    it('should reject if trying to move a directory to a file', async () => {
      // Create a file
      await module(`${srcPath}/root.txt`, distPath);

      let actual;
      try {
        // Trying to move a directory to a file
        await module(`${srcPath}/first`, `${distPath}/root.txt`);
      } catch (error) {
        actual = error;
      }

      expect(actual).toHaveProperty(
        'code',
        'ERROR_CANNOT_OVERWRITE_FILE_WITH_DIRECTORY'
      );
    });
    it('should create nested directories if they do not exist', async () => {
      const source = `${srcPath}/root.txt`;
      const destination = `${distPath}/foo/bar/destination.txt`;
      await module(source, destination);

      const actual = await isFile(destination);
      expect(actual).toEqual(true);
    });
  });
  describe('with a glob pattern', () => {
    describe('no matches', () => {
      it('should reject', async () => {
        const source = `${srcPath}/nope.*`;
        const destination = `${distPath}`;

        let actual;
        try {
          // Trying to move several files to one
          await module(source, destination);
        } catch (error) {
          actual = error;
        }

        expect(actual).toHaveProperty('code', 'ERROR_GLOB_NO_MATCHES');
      });
    });
    describe('one match', () => {
      it('should do a regular move', async () => {
        const source = `${srcPath}/f*bar`;
        const destination = `${distPath}`;
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
        const source = `${srcPath}/root.*`;
        const destination = `${distPath}/destination.txt`;

        // Create a file for the destination
        await copy(`${srcPath}/root.txt`, destination);

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
      it('should move all matches to target directory', async () => {
        const source = `${srcPath}/root.*`;
        const destination = distPath;
        await module(source, destination);

        expect(await isFile(`${distPath}/root.txt`)).toEqual(true);
        expect(await isFile(`${distPath}/root.gif`)).toEqual(true);
      });
      it('should create target directory if does not exist', async () => {
        const source = `${srcPath}/root.*`;
        const destination = `${distPath}/foo/bar`;
        await module(source, destination);

        expect(await isFile(`${distPath}/foo/bar/root.txt`)).toEqual(true);
        expect(await isFile(`${distPath}/foo/bar/root.gif`)).toEqual(true);
      });
    });
  });
});

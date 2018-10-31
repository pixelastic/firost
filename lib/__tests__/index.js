import module from '../index';
import helper from '../test-helper';
const mock = helper.mock(module);

jest.mock('glob');
import glob from 'glob';
jest.mock('fs-extra');
import fs from 'fs-extra';
jest.mock('pify');
import pify from 'pify';

describe('firost', () => {
  describe('glob', () => {
    it('is a promise wrapper around glob', async () => {
      module._glob = null;
      const mockGlob = jest.fn().mockReturnValue(['foo']);
      pify.mockReturnValue(mockGlob);

      const actual = await module.glob('pattern');

      expect(actual).toEqual(['foo']);
      expect(pify).toHaveBeenCalledWith(glob);
      expect(mockGlob).toHaveBeenCalledWith('pattern');
    });

    it('should return results ordered', async () => {
      module._glob = jest.fn().mockReturnValue(['foo_10', 'foo_100', 'foo_1']);

      const actual = await module.glob('pattern');

      expect(actual).toEqual(['foo_1', 'foo_10', 'foo_100']);
    });

    it('should return results ordered lexicographically', async () => {
      module._glob = jest
        .fn()
        .mockReturnValue(['foo_179', 'foo_18', 'foo_180']);

      const actual = await module.glob('pattern');

      expect(actual).toEqual(['foo_18', 'foo_179', 'foo_180']);
    });
  });

  describe('isDirectory', () => {
    const mockIsDirectory = jest.fn();
    const mockIsFile = jest.fn();
    beforeEach(() => {
      module._lstat = jest.fn().mockReturnValue({
        isDirectory: mockIsDirectory,
        isFile: mockIsFile,
      });
    });
    it('should return true if the path is a directory', async () => {
      fs.existsSync.mockReturnValue(true);
      mockIsDirectory.mockReturnValue(true);
      mockIsFile.mockReturnValue(false);

      const actual = await module.isDirectory('./exists');

      expect(actual).toEqual(true);
    });
    it('should return false if the path is a file', async () => {
      fs.existsSync.mockReturnValue(true);
      mockIsDirectory.mockReturnValue(false);
      mockIsFile.mockReturnValue(true);

      const actual = await module.isDirectory('./exists.txt');

      expect(actual).toEqual(false);
    });
    it('should return false if the path does not exist', async () => {
      fs.existsSync.mockReturnValue(false);

      const actual = await module.isDirectory('./does-not-exist');

      expect(actual).toEqual(false);
    });
  });

  describe('read', () => {
    it('is a promise wrapper around fs.readfile', async () => {
      module._readFile = null;
      const mockReadFile = jest.fn().mockReturnValue('foo');
      pify.mockReturnValue(mockReadFile);

      const actual = await module.read('filepath');

      expect(actual).toEqual('foo');
      expect(pify).toHaveBeenCalledWith(fs.readFile);
      expect(mockReadFile).toHaveBeenCalledWith('filepath');
    });

    it('should convert buffers to string', async () => {
      const buffer = Buffer.from('foo ‽', 'utf8');
      module._readFile = jest.fn().mockReturnValue(buffer);

      const actual = await module.read('filepath');

      expect(actual).toEqual('foo ‽');
    });
  });

  describe('readJson', () => {
    it('should return null if no such file', async () => {
      mock('read').mockImplementation(() => {
        throw new Error();
      });

      const actual = await module.readJson();

      expect(actual).toEqual(null);
    });

    it('should return null if not a Json file', async () => {
      mock('read', 'foo');

      const actual = await module.readJson();

      expect(actual).toEqual(null);
    });

    it('should parse the JSON content as an object', async () => {
      mock('read', '{"foo": "bar"}');

      const actual = await module.readJson();

      expect(actual).toHaveProperty('foo', 'bar');
    });
  });
});
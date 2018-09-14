import module from '../index';
import helper from '../test-helper';
const mock = helper.mock(module);

jest.mock('glob');
import glob from 'glob';
jest.mock('fs-extra');
import fs from 'fs-extra';
jest.mock('pify');
import pify from 'pify';

describe('fileutils', () => {
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

  describe('read', () => {
    it('is a promise wrapper around fs.readfile', async () => {
      module._readFile = null;
      const mockReadFile = jest.fn().mockReturnValue('foo');
      pify.mockReturnValue(mockReadFile);

      const actual = await module.read('filepath');

      expect(actual).toEqual('foo');
      expect(pify).toHaveBeenCalledWith(fs.readfile);
      expect(mockReadFile).toHaveBeenCalledWith('filepath');
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

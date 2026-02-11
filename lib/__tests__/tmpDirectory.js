import os from 'node:os';
import { __, tmpDirectory } from '../tmpDirectory.js';

const osTmpDir = os.tmpdir();

describe('tmpDirectory', () => {
  beforeEach(async () => {
    __.useRam = undefined;
    vi.spyOn(__, 'hasDevShm').mockReturnValue();
    vi.spyOn(__, 'uuid').mockReturnValue('__UUID__');
  });
  describe('with /dev/shm available', () => {
    beforeEach(async () => {
      vi.spyOn(__, 'hasDevShm').mockReturnValue(true);
    });
    it('should return a path from /dev/shm', () => {
      const actual = tmpDirectory();
      expect(actual).toEqual('/dev/shm/firost/__UUID__');
    });
    it('should allow passing a scope', () => {
      const actual = tmpDirectory('subdir');
      expect(actual).toEqual('/dev/shm/firost/subdir/__UUID__');
    });
    it('should allow disabling /dev/shm', () => {
      const actual = tmpDirectory({ forceDisk: true });
      expect(actual).toEqual(`${osTmpDir}/firost/__UUID__`);
    });
  });
  describe('with /dev/shm unavailable', () => {
    beforeEach(async () => {
      vi.spyOn(__, 'hasDevShm').mockReturnValue(false);
    });
    it('should return a path from /tmp', () => {
      const actual = tmpDirectory();
      expect(actual).toEqual(`${osTmpDir}/firost/__UUID__`);
    });
    it('should allow passing a scope', () => {
      const actual = tmpDirectory('subdir');
      expect(actual).toEqual(`${osTmpDir}/firost/subdir/__UUID__`);
    });
  });
  describe('ensureUseRamCheck', () => {
    it('should set based on availability', () => {
      __.hasDevShm.mockReturnValue(true);

      __.ensureUseRamCheck();

      expect(__.useRam).toEqual(true);
    });
    it('should keep in memory if called several times', () => {
      __.hasDevShm.mockReturnValue(true);

      __.ensureUseRamCheck();
      __.ensureUseRamCheck();

      expect(__.hasDevShm).toHaveBeenCalledTimes(1);
    });
  });
  describe('parseArgs', () => {
    it('should use defaults if no arg passed', () => {
      const actual = __.parseArgs();
      expect(actual).toEqual({ scope: null, userOptions: {} });
    });
    it('should overwrite both values if both args passed', () => {
      const actual = __.parseArgs('subdir', { forceDisk: true });
      expect(actual).toEqual({
        scope: 'subdir',
        userOptions: { forceDisk: true },
      });
    });
    it('should consider one arg as being the scope if it is a string', () => {
      const actual = __.parseArgs('subdir');
      expect(actual).toEqual({ scope: 'subdir', userOptions: {} });
    });
    it('should conside one arg as being the options if it is an object', () => {
      const actual = __.parseArgs({ forceDisk: true });
      expect(actual).toEqual({ scope: null, userOptions: { forceDisk: true } });
    });
  });
});

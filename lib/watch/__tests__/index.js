import current from '../index.js';
import write from '../../write.js';
import remove from '../../remove.js';
import cache from '../../cache.js';
import absolute from '../../absolute.js';
import unwatchAll from '../unwatchAll.js';
import waitForWatchers from '../waitForWatchers.js';
import emptyDir from '../../emptyDir.js';
import firostRoot from '../../test-helpers/firostRoot.js';

describe('watch', () => {
  const tmpDir = absolute(firostRoot, '/tmp/watch/index');
  beforeEach(async () => {
    await emptyDir(tmpDir);
  });
  afterEach(async () => {
    await unwatchAll();
    cache.clearAll();
  });

  describe('with static paths', () => {
    it('should trigger a created event when file is added', async () => {
      const filepath = `${tmpDir}/myfile`;
      const callback = vi.fn();
      await current(filepath, callback);

      await write('something', filepath);

      await waitForWatchers();
      expect(callback).toHaveBeenCalledWith(filepath, 'created');
    });
    it('should trigger a modifier event when file is updated', async () => {
      const filepath = `${tmpDir}/myfile`;
      const callback = vi.fn();
      await write('something', filepath);
      await current(filepath, callback);

      await write('something else', filepath);

      await waitForWatchers();
      expect(callback).toHaveBeenCalledWith(filepath, 'modified');
    });
    it('should trigger a deleted event when file is removed', async () => {
      const filepath = `${tmpDir}/myfile`;
      const callback = vi.fn();
      await write('something', filepath);
      await current(filepath, callback);

      await remove(filepath);

      await waitForWatchers();
      expect(callback).toHaveBeenCalledWith(filepath, 'deleted');
    });
    it('should not trigger on files not matching the pattern', async () => {
      const filepath = `${tmpDir}/myfile`;
      const callback = vi.fn();
      await current(filepath, callback);

      await write('something', `${tmpDir}/something_else`);

      await waitForWatchers();
      expect(callback).not.toHaveBeenCalled();
    });
    it('should not trigger on files already there', async () => {
      const filepath = `${tmpDir}/myfile`;
      const callback = vi.fn();
      await write('something', filepath);
      await current(filepath, callback);

      await waitForWatchers();
      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('with array of paths', () => {
    it('should trigger on all paths of array', async () => {
      const scriptFile = `${tmpDir}/script.js`;
      const docFile = `${tmpDir}/doc.md`;
      const filepaths = [scriptFile, docFile];
      const callback = vi.fn();
      await current(filepaths, callback);

      await write('// Some script', scriptFile);
      await write('# Some doc', docFile);

      await waitForWatchers();
      expect(callback).toHaveBeenCalledWith(scriptFile, 'created');
      expect(callback).toHaveBeenCalledWith(docFile, 'created');
    });
    it('should not trigger on other files in same directory', async () => {
      const scriptFile = `${tmpDir}/script.js`;
      const docFile = `${tmpDir}/doc.md`;
      const filepaths = [scriptFile, docFile];
      const callback = vi.fn();
      await current(filepaths, callback);

      await write('# Config file', `${tmpDir}/config.yml`);

      await waitForWatchers();
      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('with glob patterns', () => {});
});

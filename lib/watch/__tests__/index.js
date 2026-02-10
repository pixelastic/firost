import path from 'node:path';
import { tmpDirectory } from 'firost';
import { cache } from '../../cache.js';
import { dirname } from '../../dirname.js';
import { remove } from '../../remove.js';
import { write } from '../../write.js';
import { unwatchAll } from '../unwatchAll.js';
import { waitForWatchers } from '../waitForWatchers.js';
import { watch } from '../watch.js';

describe('watch', () => {
  const testDirectory = tmpDirectory(`firost/${describeName}/index`);
  afterEach(async () => {
    await unwatchAll();
    cache.clearAll();
    await remove(testDirectory);
  });

  describe('with static paths', () => {
    it('should trigger a created event when file is added', async () => {
      const filepath = `${testDirectory}/myfile`;
      const callback = vi.fn();
      await watch(filepath, callback);

      await write('something', filepath);

      await waitForWatchers();
      expect(callback).toHaveBeenCalledWith(filepath, 'created');
    });
    it('should trigger a modifier event when file is updated', async () => {
      const filepath = `${testDirectory}/myfile`;
      const callback = vi.fn();
      await write('something', filepath);
      await watch(filepath, callback);

      await write('something else', filepath);

      await waitForWatchers();
      expect(callback).toHaveBeenCalledWith(filepath, 'modified');
    });
    it('should trigger a deleted event when file is removed', async () => {
      const filepath = `${testDirectory}/myfile`;
      const callback = vi.fn();
      await write('something', filepath);
      await watch(filepath, callback);

      await remove(filepath);

      await waitForWatchers();
      expect(callback).toHaveBeenCalledWith(filepath, 'deleted');
    });
    it('should not trigger on files not matching the pattern', async () => {
      const filepath = `${testDirectory}/myfile`;
      const callback = vi.fn();
      await watch(filepath, callback);

      await write('something', `${testDirectory}/something_else`);

      await waitForWatchers();
      expect(callback).not.toHaveBeenCalled();
    });
    it('should not trigger on files already there', async () => {
      const filepath = `${testDirectory}/myfile`;
      const callback = vi.fn();
      await write('something', filepath);
      await watch(filepath, callback);

      await waitForWatchers();
      expect(callback).not.toHaveBeenCalled();
    });
    it('should trigger on relative paths', async () => {
      const absoluteFilepath = `${testDirectory}/myfile`;
      const relativeFilepath = path.relative(dirname(), absoluteFilepath);

      const callback = vi.fn();
      await write('something', absoluteFilepath);
      await watch(relativeFilepath, callback);

      await write('something else', absoluteFilepath);
      await waitForWatchers();
      expect(callback).toHaveBeenCalledWith(absoluteFilepath, 'modified');
    });
  });

  describe('with array of paths', () => {
    it('should trigger on all paths of array', async () => {
      const scriptFile = `${testDirectory}/script.js`;
      const docFile = `${testDirectory}/doc.md`;
      const filepaths = [scriptFile, docFile];
      const callback = vi.fn();
      await watch(filepaths, callback);

      await write('// Some script', scriptFile);
      await write('# Some doc', docFile);

      await waitForWatchers();
      expect(callback).toHaveBeenCalledWith(scriptFile, 'created');
      expect(callback).toHaveBeenCalledWith(docFile, 'created');
    });
    it('should not trigger on other files in same directory', async () => {
      const scriptFile = `${testDirectory}/script.js`;
      const docFile = `${testDirectory}/doc.md`;
      const filepaths = [scriptFile, docFile];
      const callback = vi.fn();
      await watch(filepaths, callback);

      await write('# Config file', `${testDirectory}/config.yml`);

      await waitForWatchers();
      expect(callback).not.toHaveBeenCalled();
    });
  });
});

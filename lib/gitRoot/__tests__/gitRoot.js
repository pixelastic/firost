import path from 'path';
import current from '../index.js';
import write from '../../write.js';
import read from '../../read.js';
import tmpDirectory from '../../tmpDirectory.js';
import exists from '../../exists.js';

describe('gitRoot', () => {
  it('should return the current git root folder', async () => {
    const actual = current();
    const hasGitFolder = await exists(path.resolve(actual, '.git'));
    expect(hasGitFolder).toBe(true);
  });
  describe('with a reference', () => {
    it('as a directory', async () => {
      const gitRoot = tmpDirectory('firost/gitRoot');
      await write('good', path.resolve(gitRoot, '.git', 'read-me'));

      const actual = current(path.resolve(gitRoot, 'some/sub/directory'));
      const fileContent = await read(path.resolve(actual, '.git', 'read-me'));
      expect(fileContent).toBe('good');
    });
    it('as a file', async () => {
      const gitRoot = tmpDirectory('firost/packageRoot');
      await write('good', path.resolve(gitRoot, '.git', 'read-me'));

      const actual = current(
        path.resolve(gitRoot, 'some/sub/directory/somefile.png'),
      );
      const fileContent = await read(path.resolve(actual, '.git', 'read-me'));
      expect(fileContent).toBe('good');
    });
  });
});

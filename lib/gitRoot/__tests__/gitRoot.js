import path from 'node:path';
import { gitRoot } from '../index.js';
import { write } from '../../write.js';
import { read } from '../../read.js';
import { tmpDirectory } from '../../tmpDirectory.js';
import { exists } from '../../exists.js';

describe('gitRoot', () => {
  it('should return the closest gitRoot in userland', async () => {
    const actual = gitRoot();
    const hasGitFolder = await exists(path.resolve(actual, '.git'));
    expect(hasGitFolder).toBe(true);
  });
  describe('with a reference', () => {
    it('as a directory', async () => {
      const gitRootPath = tmpDirectory('firost/gitRoot');
      await write('good', path.resolve(gitRootPath, '.git', 'read-me'));

      const actual = gitRoot(path.resolve(gitRootPath, 'some/sub/directory'));
      const fileContent = await read(path.resolve(actual, '.git', 'read-me'));
      expect(fileContent).toBe('good');
    });
    it('as a file', async () => {
      const gitRootPath = tmpDirectory('firost/packageRoot');
      await write('good', path.resolve(gitRootPath, '.git', 'read-me'));

      const actual = gitRoot(
        path.resolve(gitRootPath, 'some/sub/directory/somefile.png'),
      );
      const fileContent = await read(path.resolve(actual, '.git', 'read-me'));
      expect(fileContent).toBe('good');
    });
  });
});

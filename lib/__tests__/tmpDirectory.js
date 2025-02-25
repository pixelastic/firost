import tempDir from 'temp-dir';
import { tmpDirectory } from '../tmpDirectory.js';

describe('tmpDirectory', () => {
  it('should return a directory in tmp folder', async () => {
    const actual = tmpDirectory();
    expect(actual).toStartWith(tempDir);
  });
  it('should allow passing a scope', async () => {
    const actual = tmpDirectory('firost');
    expect(actual).toStartWith(`${tempDir}/firost`);
  });
});

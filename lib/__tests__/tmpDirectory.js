import current from '../tmpDirectory.js';
import tempDir from 'temp-dir';

describe('tmpDirectory', () => {
  it('should return a directory in tmp folder', async () => {
    const actual = current();
    expect(actual).toStartWith(tempDir);
  });
  it('should allow passing a scope', async () => {
    const actual = current('firost');
    expect(actual).toStartWith(`${tempDir}/firost`);
  });
});

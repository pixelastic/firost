import absolute from '../absolute.js';
import current from '../callstack.js';
import emptyDir from '../emptyDir.js';
import here from '../here.js';

describe('callstack', () => {
  const tmpDir = absolute('<gitRoot>/tmp/callstack');
  beforeEach(async () => {
    await emptyDir(tmpDir);
  });
  it('should have the current file as the first element', async () => {
    const actual = current();

    expect(actual[0]).toHaveProperty('filepath', here());
  });
  it('should find the right function name', async function myCustomFunction() {
    const actual = current();

    expect(actual[0]).toHaveProperty('function', 'myCustomFunction');
  });
});

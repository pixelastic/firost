import current from '../dirname.js';
import emptyDir from '../emptyDir.js';
import absolute from '../absolute.js';
import write from '../write.js';
import run from '../run.js';
import path from 'path';

describe('dirname', () => {
  const tmpDir = './tmp/dirname';
  beforeEach(async () => {
    await emptyDir(tmpDir);
  });
  it('should return directory of this test', async () => {
    const actual = current();
    expect(actual).toEqual(absolute('./lib/__tests__'));
  });
  it('should return directory of an arbitrary file', async () => {
    // Absolute path to the module code
    const modulePath = absolute('./lib/dirname.js');

    // Writing a test file in a temp directory
    const scriptDirectory = absolute(tmpDir);
    const scriptFilepath = path.resolve(scriptDirectory, 'script.js');
    await write(
      dedent`
      import dirname from '${modulePath}';
      console.log(dirname());
    `,
      scriptFilepath,
    );

    const output = await run(`node ${scriptFilepath}`, { stdout: false });
    const actual = output.stdout;
    expect(actual).toEqual(scriptDirectory);
  });
});

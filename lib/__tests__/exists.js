import module from '../exists';
import mkdirp from '../mkdirp';
import write from '../write';
import emptyDir from '../emptyDir';

describe('exists', () => {
  const tmpDir = './tmp/exists';
  beforeEach(async () => {
    await emptyDir(tmpDir);
  });
  it('should return true if the target is a file', async () => {
    await write('foo', `${tmpDir}/foo.txt`);

    const actual = await module(`${tmpDir}/foo.txt`);

    expect(actual).toEqual(true);
  });
  it('should return true if the target is a directory', async () => {
    await mkdirp(`${tmpDir}/folder`);

    const actual = await module(`${tmpDir}/folder`);

    expect(actual).toEqual(true);
  });
  it('should return false if the target does not exist', async () => {
    const actual = await module(`${tmpDir}/nope`);

    expect(actual).toEqual(false);
  });
});

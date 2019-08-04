import module from '../remove';
import exists from '../exists';
import write from '../write';
import mkdirp from '../mkdirp';
import emptyDir from '../emptyDir';

describe('remove', () => {
  const tmpDir = './tmp/remove';
  beforeEach(async () => {
    await emptyDir(tmpDir);
  });
  it('should stay silent if the file does not exist', async () => {
    let actual = 'foo';

    try {
      await module(`${tmpDir}/nope.nope`);
    } catch (error) {
      actual = error;
    }

    expect(actual).toEqual('foo');
  });
  it('should delete the target file', async () => {
    await write('foo', `${tmpDir}/foo.txt`);

    await module(`${tmpDir}/foo.txt`);

    expect(await exists(`${tmpDir}/foo.txt`)).toEqual(false);
  });
  it('should delete the target directory', async () => {
    await mkdirp(`${tmpDir}/folder`);

    await module(`${tmpDir}/folder`);

    expect(await exists(`${tmpDir}/folder`)).toEqual(false);
  });
  it('should delete all matching globs', async () => {
    await write('foo', `${tmpDir}/foo.txt`);
    await write('bar', `${tmpDir}/bar.txt`);
    await write('baz', `${tmpDir}/baz.txt`);

    await module(`${tmpDir}/b*.txt`);

    expect(await exists(`${tmpDir}/bar.txt`)).toEqual(false);
    expect(await exists(`${tmpDir}/baz.txt`)).toEqual(false);
  });
});

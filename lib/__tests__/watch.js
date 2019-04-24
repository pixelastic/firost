import module from '../watch';
import copy from '../copy';
import write from '../write';
import remove from '../remove';
import helper from '../test-helper';
const fixturePath = helper.fixturePath();
const tmpPath = helper.tmpPath('watch');

describe('watch', () => {
  let watcher;
  beforeEach(async () => {
    await helper.clearTmpDirectory('watch');
    await copy(`${fixturePath}/*`, tmpPath);
  });
  afterEach(async () => {
    await watcher.kill();
  });
  it('should fire when file is modified', async () => {
    const pattern = `${tmpPath}/foo*`;
    const target = `${tmpPath}/foo_10`;
    const callback = jest.fn();
    watcher = await module(pattern, callback);

    await write('foo', target);

    expect(callback).toHaveBeenCalledWith(target, 'modified');
  });
  it('should fire when file is added', async () => {
    const pattern = `${tmpPath}/foo*`;
    const target = `${tmpPath}/foo_new`;
    const callback = jest.fn();
    watcher = await module(pattern, callback);

    await write('foo', target);
    await watcher.kill();

    expect(callback).toHaveBeenCalledWith(target, 'created');
  });
  it('should fire when file is deleted', async () => {
    const pattern = `${tmpPath}/foo*`;
    const target = `${tmpPath}/foo_10`;
    const callback = jest.fn();
    watcher = await module(pattern, callback);

    await remove(target);
    await watcher.kill();

    expect(callback).toHaveBeenCalledWith(target, 'removed');
  });
  it('should not fire for existing files at startup', async () => {
    const pattern = `${tmpPath}/foo*`;
    const callback = jest.fn();
    watcher = await module(pattern, callback);

    await watcher.kill();

    expect(callback).not.toHaveBeenCalled();
  });
});

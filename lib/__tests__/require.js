const current = require('../require');
const write = require('../write');
const emptyDir = require('../emptyDir');
const path = require('path');
const uuid = require('../uuid');

describe('require', () => {
  const tmpDir = './tmp/copy';
  beforeEach(async () => {
    await emptyDir(tmpDir);
  });
  it('should require the specified id', () => {
    jest.spyOn(current, '__require').mockReturnValue();
    current('foo');

    expect(current.__require).toHaveBeenCalledWith('foo');
  });
  it('should return the required current', () => {
    jest.spyOn(current, '__require').mockReturnValue('foo');
    const actual = current('foo');

    expect(actual).toEqual('foo');
  });
  it('should require module.exports currents', async () => {
    const input = path.resolve(`${tmpDir}/${uuid()}.js`);
    await write('module.exports = "foo"', input);

    const actual = current(input);
    expect(actual).toEqual('foo');
  });
  it('should return the default key if present', async () => {
    const input = path.resolve(`${tmpDir}/${uuid()}.js`);
    await write('module.exports = { default: "foo" }', input);

    const actual = current(input);
    expect(actual).toEqual('foo');
  });
  it('should work with relative paths', async () => {
    const absoluteInput = path.resolve(`${tmpDir}/${uuid()}.js`);
    const relativeInput = path.relative(__dirname, absoluteInput);

    await write('module.exports = "foo"', absoluteInput);

    const actual = current(relativeInput);
    expect(actual).toEqual('foo');
  });
  it('should clear the cache if asked', async () => {
    jest.spyOn(current, '__clearCache').mockReturnValue();
    const input = path.resolve(`${tmpDir}/${uuid()}.js`);
    await write('module.exports = { default: "foo" }', input);

    current(input, { forceReload: true });
    expect(current.__clearCache).toHaveBeenCalledWith(input);
  });
});

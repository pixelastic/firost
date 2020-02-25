const module = require('../require');
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
    jest.spyOn(module, '__require').mockReturnValue();
    module('foo');

    expect(module.__require).toHaveBeenCalledWith('foo');
  });
  it('should return the required module', () => {
    jest.spyOn(module, '__require').mockReturnValue('foo');
    const actual = module('foo');

    expect(actual).toEqual('foo');
  });
  it('should require module.exports modules', async () => {
    const input = path.resolve(`${tmpDir}/${uuid()}.js`);
    await write('module.exports = "foo"', input);

    const actual = module(input);
    expect(actual).toEqual('foo');
  });
  it('should return the default key if present', async () => {
    const input = path.resolve(`${tmpDir}/${uuid()}.js`);
    await write('module.exports = { default: "foo" }', input);

    const actual = module(input);
    expect(actual).toEqual('foo');
  });
  it('should work with relative paths', async () => {
    const absoluteInput = path.resolve(`${tmpDir}/${uuid()}.js`);
    const relativeInput = path.relative(__dirname, absoluteInput);

    await write('module.exports = "foo"', absoluteInput);

    const actual = module(relativeInput);
    expect(actual).toEqual('foo');
  });
  // Note that we do not test if passing forceReload: true actually works
  // This is because Jest overwrites the default require() call with its own,
  // and clearing its cache does not seem to have any effect
});

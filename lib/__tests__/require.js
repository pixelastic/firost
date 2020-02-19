const module = jestImport('../require');
const write = jestImport('../write');
const emptyDir = jestImport('../emptyDir');
const path = jestImport('path');
const uuid = jestImport('../uuid');

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
  it('should require export default modules', async () => {
    const input = path.resolve(`${tmpDir}/${uuid()}.js`);
    await write('export default "foo"', input);

    const actual = module(input);
    expect(actual).toEqual('foo');
  });
  it('should allow import syntax', async () => {
    const module1 = path.resolve(`${tmpDir}/${uuid()}.js`);
    await write('export default { name: "foo" }', module1);
    const module2 = path.resolve(`${tmpDir}/${uuid()}.js`);
    await write(`import data from "${module1}"; export default data`, module2);

    const actual = module(module2);
    expect(actual).toHaveProperty('name', 'foo');
  });
  // Note that we do not test if passing forceReload: true actually works
  // This is because Jest overwrites the default require() call with its own,
  // and clearing its cache does not seem to have any effect
});

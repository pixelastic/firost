import module from '../require';

describe('require', () => {
  beforeEach(() => {
    jest.spyOn(module, '__require').mockReturnValue();
  });
  it('should require the specified id', () => {
    module('foo');

    expect(module.__require).toHaveBeenCalledWith('foo');
  });
  it('should return the required module', () => {
    jest.spyOn(module, '__require').mockReturnValue('foo');
    const actual = module('foo');

    expect(actual).toEqual('foo');
  });
  it('should return the default key if there is one', () => {
    jest.spyOn(module, '__require').mockReturnValue({ default: 'foo' });
    const actual = module('foo');

    expect(actual).toEqual('foo');
  });
  it('relative requires should be relative to the current script', () => {
    module('./foo.js');

    expect(module.__require).toHaveBeenCalledWith(`${__dirname}/foo.js`);
  });
  it('absolute require should be called directly', () => {
    module('/foo.js');

    expect(module.__require).toHaveBeenCalledWith('/foo.js');
  });
  // Note that we do not test if passing forceReload: true actually works
  // This is because Jest overwrites the default require() call with its own,
  // and clearing its cache does not seem to have any effect
});
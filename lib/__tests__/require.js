import current from '../require.js';
import write from '../write.js';
import emptyDir from '../emptyDir.js';
import path from 'path';
import uuid from '../uuid.js';

describe('require', () => {
  const tmpDir = './tmp/copy';
  beforeEach(async () => {
    await emptyDir(tmpDir);
  });
  it('should require the specified id', () => {
    vi.spyOn(current, '__require').mockReturnValue();
    current('foo');

    expect(current.__require).toHaveBeenCalledWith('foo');
  });
  it('should return the required current', () => {
    vi.spyOn(current, '__require').mockReturnValue('foo');
    const actual = current('foo');

    expect(actual).toBe('foo');
  });
  it('should require module.exports currents', async () => {
    const input = path.resolve(`${tmpDir}/${uuid()}.js`);
    await write('module.exports = "foo"', input);

    const actual = current(input);
    expect(actual).toBe('foo');
  });
  it('should return the default key if present', async () => {
    const input = path.resolve(`${tmpDir}/${uuid()}.js`);
    await write('module.exports = { default: "foo" }', input);

    const actual = current(input);
    expect(actual).toBe('foo');
  });
  it('should work with relative paths', async () => {
    const absoluteInput = path.resolve(`${tmpDir}/${uuid()}.js`);
    const relativeInput = path.relative(__dirname, absoluteInput);

    await write('module.exports = "foo"', absoluteInput);

    const actual = current(relativeInput);
    expect(actual).toBe('foo');
  });
  it('should clear the cache if asked', async () => {
    vi.spyOn(current, '__clearCache').mockReturnValue();
    const input = path.resolve(`${tmpDir}/${uuid()}.js`);
    await write('module.exports = { default: "foo" }', input);

    current(input, { forceReload: true });
    expect(current.__clearCache).toHaveBeenCalledWith(input);
  });
});

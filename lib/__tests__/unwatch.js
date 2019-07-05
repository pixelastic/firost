import module from '../unwatch';
import cache from '../cache';
import watch from '../watch';
import unwatchAll from '../unwatchAll';

describe('unwatch', () => {
  afterEach(async () => {
    await unwatchAll();
    cache.clearAll();
  });

  it('should return false if no name passed', async () => {
    const actual = await module();
    expect(actual).toEqual(false);
  });
  it('should return false if no such watcher', async () => {
    const actual = await module('foo');
    expect(actual).toEqual(false);
  });
  it('should return true if watcher is killed', async () => {
    await watch('pattern', jest.fn(), 'foo');

    const actual = await module('foo');
    expect(actual).toEqual(true);
  });
  it('should kill the watcher specified', async () => {
    const watcher = await watch('pattern', jest.fn(), 'foo');
    jest.spyOn(watcher, '__kill');

    await module('foo');
    expect(watcher.__kill).toHaveBeenCalled();
  });
  it('should remove the watcher from the list', async () => {
    await watch('pattern', jest.fn(), 'foo');

    const before = cache.read('watchers.named');
    await module('foo');
    const after = cache.read('watchers.named');

    expect(before).toHaveProperty('foo');
    expect(after).toEqual({});
  });
  it('should allow to unwatch deeply recursively', async () => {
    const watcher1 = await watch('pattern', jest.fn(), 'foo.deep.one');
    const watcher2 = await watch('pattern', jest.fn(), 'foo.deep.two');
    const watcher3 = await watch('pattern', jest.fn(), 'foo.bar');
    jest.spyOn(watcher1, '__kill');
    jest.spyOn(watcher2, '__kill');
    jest.spyOn(watcher3, '__kill');

    await module('foo');

    expect(watcher1.__kill).toHaveBeenCalled();
    expect(watcher2.__kill).toHaveBeenCalled();
    expect(watcher3.__kill).toHaveBeenCalled();
  });
});

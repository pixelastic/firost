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
});

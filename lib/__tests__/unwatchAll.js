import module from '../unwatchAll';
import cache from '../cache';

describe('unwatch', () => {
  beforeEach(async () => {
    cache.clearAll();
  });
  it('should kill all unnamed watchers', async () => {
    const kill1 = jest.fn();
    const kill2 = jest.fn();
    cache.write([{ __kill: kill1 }, { __kill: kill2 }], 'watchers.raw');

    await module();

    expect(kill1).toHaveBeenCalled();
    expect(kill2).toHaveBeenCalled();
  });
  it('should kill all named watchers', async () => {
    const kill1 = jest.fn();
    const kill2 = jest.fn();
    cache.write(
      { foo: { __kill: kill1 }, bar: { __kill: kill2 } },
      'watchers.named'
    );

    await module();

    expect(kill1).toHaveBeenCalled();
    expect(kill2).toHaveBeenCalled();
  });
  it('should clear the watcher lists', async () => {
    const mockWatcher = { __kill: jest.fn() };
    cache.write(
      {
        named: {
          foo: mockWatcher,
          bar: mockWatcher,
        },
        raw: [mockWatcher, mockWatcher],
      },
      'watchers'
    );

    await module();

    expect(cache.raw()).toEqual({ watchers: { named: {}, raw: [] } });
  });
});

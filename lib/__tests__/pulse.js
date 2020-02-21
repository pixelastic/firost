const module = jestImport('../pulse');

describe('pulse', () => {
  beforeEach(() => {
    module.removeAllListeners();
  });
  it('should trigger methods when emitted', () => {
    const actual = jest.fn();
    module.on('foo', actual);
    module.emit('foo', 'bar');

    expect(actual).toHaveBeenCalledWith('bar');
  });
  it('should listen with wildcard', () => {
    const actual = jest.fn();
    module.on('foo.*', actual);
    module.emit('foo.bar', 'bar');

    expect(actual).toHaveBeenCalledWith('bar');
  });
  it('should listen with wildcard on first field', () => {
    const actual = jest.fn();
    module.on('*.bar', actual);
    module.emit('foo.bar', 'bar');

    expect(actual).toHaveBeenCalledWith('bar');
  });
});
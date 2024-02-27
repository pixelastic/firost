import current from '../pulse.js';

describe('pulse', () => {
  beforeEach(() => {
    current.removeAllListeners();
  });
  it('should trigger methods when emitted', () => {
    const actual = vi.fn();
    current.on('foo', actual);
    current.emit('foo', 'bar');

    expect(actual).toHaveBeenCalledWith('bar');
  });
  it('should listen with wildcard', () => {
    const actual = vi.fn();
    current.on('foo.*', actual);
    current.emit('foo.bar', 'bar');

    expect(actual).toHaveBeenCalledWith('bar');
  });
  it('should listen with wildcard on first field', () => {
    const actual = vi.fn();
    current.on('*.bar', actual);
    current.emit('foo.bar', 'bar');

    expect(actual).toHaveBeenCalledWith('bar');
  });
});

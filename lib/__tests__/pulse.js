import { pulse } from '../pulse.js';

describe('pulse', () => {
  beforeEach(() => {
    pulse.removeAllListeners();
  });
  it('should trigger methods when emitted', () => {
    const actual = vi.fn();
    pulse.on('foo', actual);
    pulse.emit('foo', 'bar');

    expect(actual).toHaveBeenCalledWith('bar');
  });
  it('should listen with wildcard', () => {
    const actual = vi.fn();
    pulse.on('foo.*', actual);
    pulse.emit('foo.bar', 'bar');

    expect(actual).toHaveBeenCalledWith('bar');
  });
  it('should listen with wildcard on first field', () => {
    const actual = vi.fn();
    pulse.on('*.bar', actual);
    pulse.emit('foo.bar', 'bar');

    expect(actual).toHaveBeenCalledWith('bar');
  });
});

import module from '../pulse';

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
});

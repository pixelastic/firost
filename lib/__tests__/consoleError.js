import current from '../consoleError.js';

describe('consoleError', () => {
  beforeEach(() => {
    vi.spyOn(console, 'info').mockReturnValue();
  });
  it('should be prefixed with red ✘', () => {
    current('foo');

    expect(console.info).toHaveBeenCalledWith(
      expect.stringContaining('✘'),
      'foo',
    );
  });
});

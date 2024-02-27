import current from '../consoleWarn.js';

describe('consoleWarn', () => {
  beforeEach(() => {
    vi.spyOn(console, 'info').mockReturnValue();
  });
  it('should be prefixed with yellow ⚠', () => {
    current('foo');

    expect(console.info).toHaveBeenCalledWith(
      expect.stringContaining('⚠'),
      'foo',
    );
  });
});

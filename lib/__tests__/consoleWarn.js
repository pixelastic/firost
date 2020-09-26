const current = require('../consoleWarn');

describe('consoleWarn', () => {
  beforeEach(() => {
    jest.spyOn(console, 'info').mockReturnValue();
  });
  it('should be prefixed with yellow ⚠', () => {
    current('foo');

    expect(console.info).toHaveBeenCalledWith(
      expect.stringContaining('⚠'),
      'foo'
    );
  });
});

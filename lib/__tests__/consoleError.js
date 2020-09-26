const current = require('../consoleError');

describe('consoleError', () => {
  beforeEach(() => {
    jest.spyOn(console, 'info').mockReturnValue();
  });
  it('should be prefixed with red ✘', () => {
    current('foo');

    expect(console.info).toHaveBeenCalledWith(
      expect.stringContaining('✘'),
      'foo'
    );
  });
});

const current = require('../consoleInfo');

describe('consoleInfo', () => {
  beforeEach(() => {
    jest.spyOn(console, 'info').mockReturnValue();
  });
  it('should be prefixed with •', () => {
    current('foo');

    expect(console.info).toHaveBeenCalledWith(
      expect.stringContaining('•'),
      'foo'
    );
  });
});

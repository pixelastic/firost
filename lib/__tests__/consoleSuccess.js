const current = require('../consoleSuccess');

describe('consoleSuccess', () => {
  beforeEach(() => {
    jest.spyOn(console, 'info').mockReturnValue();
  });
  it('should be prefixed with green ✔', () => {
    current('foo');

    expect(console.info).toHaveBeenCalledWith(
      expect.stringContaining('✔'),
      'foo'
    );
  });
});

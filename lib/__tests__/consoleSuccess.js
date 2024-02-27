import current from '../consoleSuccess.js';

describe('consoleSuccess', () => {
  beforeEach(() => {
    vi.spyOn(console, 'info').mockReturnValue();
  });
  it('should be prefixed with green ✔', () => {
    current('foo');

    expect(console.info).toHaveBeenCalledWith(
      expect.stringContaining('✔'),
      'foo',
    );
  });
});

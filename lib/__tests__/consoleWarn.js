import { consoleWarn } from '../consoleWarn.js';

describe('consoleWarn', () => {
  beforeEach(() => {
    vi.spyOn(console, 'info').mockReturnValue();
  });
  it('should be prefixed with yellow ⚠', () => {
    consoleWarn('foo');

    expect(console.info).toHaveBeenCalledWith(
      expect.stringContaining('⚠'),
      'foo',
    );
  });
});

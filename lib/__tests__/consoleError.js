import { consoleError } from '../consoleError.js';

describe('consoleError', () => {
  beforeEach(() => {
    vi.spyOn(console, 'info').mockReturnValue();
  });
  it('should be prefixed with red ✘', () => {
    consoleError('foo');

    expect(console.info).toHaveBeenCalledWith(
      expect.stringContaining('✘'),
      'foo',
    );
  });
});

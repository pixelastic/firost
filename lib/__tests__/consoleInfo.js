import { consoleInfo } from '../consoleInfo.js';

describe('consoleInfo', () => {
  beforeEach(() => {
    vi.spyOn(console, 'info').mockReturnValue();
  });
  it('should be prefixed with •', () => {
    consoleInfo('foo');

    expect(console.info).toHaveBeenCalledWith(
      expect.stringContaining('•'),
      'foo',
    );
  });
});

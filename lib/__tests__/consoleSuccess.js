import { consoleSuccess } from '../consoleSuccess.js';

describe('consoleSuccess', () => {
  beforeEach(() => {
    vi.spyOn(console, 'info').mockReturnValue();
  });
  it('should be prefixed with green ✔', () => {
    consoleSuccess('foo');

    expect(console.info).toHaveBeenCalledWith(
      expect.stringContaining('✔'),
      'foo',
    );
  });
});

import current from '../which.js';

describe('which', () => {
  it('should return the path to the executable', async () => {
    const input = 'touch';

    const actual = await current(input);

    expect(actual).toStartWith('/');
    expect(actual).toEndWith('touch');
  });
  it('should return false if no executable found', async () => {
    const input = 'nopenopenope';

    const actual = await current(input);

    expect(actual).toBe(false);
  });
});

const current = require('../sleep');

describe('sleep', () => {
  it('should wait the specified amound of time', async () => {
    const before = new Date();
    await current(100);
    const after = new Date();
    expect(after - before).toBeGreaterThanOrEqual(100);
  });
});

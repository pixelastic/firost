import { sleep } from '../sleep.js';

describe('sleep', () => {
  it('should wait the specified amound of time', async () => {
    const before = new Date();
    await sleep(100);
    const after = new Date();

    // Timer in setTimeout and new Date() are not synchronized perfectly,
    // especially under heavy load, like when running the full test suite.
    // So we account for a small difference
    expect(after - before).toBeGreaterThanOrEqual(95);
  });
});

import { sleep } from '../sleep.js';

describe('sleep', () => {
  it('should wait the specified amound of time', async () => {
    const before = new Date();
    await sleep(100);
    const after = new Date();
    expect(after - before).toBeGreaterThanOrEqual(100);
  });
});

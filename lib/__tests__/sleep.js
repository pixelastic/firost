const module = jestImport('../sleep');

describe('sleep', () => {
  it('should wait the specified amound of time', async () => {
    const before = new Date();
    await module(100);
    const after = new Date();
    expect(after - before).toBeGreaterThanOrEqual(90);
    expect(after - before).toBeLessThanOrEqual(110);
  });
});

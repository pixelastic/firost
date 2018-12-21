import module from '../glob';
import helper from '../test-helper';
const fixturePath = helper.fixturePath();

describe('glob', () => {
  it('should find files with *', async () => {
    const actual = await module(`${fixturePath}/*.txt`);

    expect(actual).toContain(`${fixturePath}/root.txt`);
  });
  it('should find files with **', async () => {
    const actual = await module(`${fixturePath}/**/*.txt`);

    expect(actual).toContain(`${fixturePath}/root.txt`);
    expect(actual).toContain(`${fixturePath}/first/first.txt`);
    expect(actual).toContain(`${fixturePath}/first/second/second.txt`);
  });
  it('should return results ordered', async () => {
    const actual = await module(`${fixturePath}/foo*`);

    expect(actual).toEqual([
      `${fixturePath}/foo_1`,
      `${fixturePath}/foo_10`,
      `${fixturePath}/foo_18`,
      `${fixturePath}/foo_100`,
      `${fixturePath}/foo_179`,
      `${fixturePath}/foo_180`,
      `${fixturePath}/foo_bar`,
    ]);
  });
});

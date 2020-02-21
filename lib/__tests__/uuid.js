const module = jestImport('../uuid');

describe('uuid', () => {
  it('should return a 21 characters long string', () => {
    const actual = module();

    expect(actual).toBeString();
    expect(actual).toHaveLength(21);
  });
  it('should return different values each time', () => {
    expect(module()).not.toEqual(module());
  });
});
const module = jestImport('../exit');

describe('exit', () => {
  beforeEach(async () => {
    jest.spyOn(process, 'exit').mockReturnValue();
  });
  it('should stop process with specified exitCode', async () => {
    module(42);

    expect(process.exit).toHaveBeenCalledWith(42);
  });
});
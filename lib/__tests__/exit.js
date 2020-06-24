const current = require('../exit');

describe('exit', () => {
  beforeEach(async () => {
    jest.spyOn(process, 'exit').mockReturnValue();
  });
  it('should stop process with specified exitCode', async () => {
    current(42);

    expect(process.exit).toHaveBeenCalledWith(42);
  });
});

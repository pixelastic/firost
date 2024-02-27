import current from '../exit.js';

describe('exit', () => {
  beforeEach(async () => {
    vi.spyOn(process, 'exit').mockReturnValue();
  });
  it('should stop process with specified exitCode', async () => {
    current(42);

    expect(process.exit).toHaveBeenCalledWith(42);
  });
});

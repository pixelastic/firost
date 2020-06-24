const current = require('../prompt');

describe('prompt', () => {
  beforeEach(() => {
    jest.spyOn(current, '__inquirerPrompt').mockReturnValue();
  });
  it('should ask the given question', async () => {
    await current('Question?');

    expect(current.__inquirerPrompt).toHaveBeenCalledWith([
      { name: 'answer', message: 'Question?' },
    ]);
  });
  it('should return the answer key', async () => {
    jest.spyOn(current, '__inquirerPrompt').mockReturnValue({ answer: 'foo' });

    const actual = await current('Question?');

    expect(actual).toEqual('foo');
  });
});

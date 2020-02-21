const module = require('../prompt');

describe('prompt', () => {
  beforeEach(() => {
    jest.spyOn(module, '__inquirerPrompt').mockReturnValue();
  });
  it('should ask the given question', async () => {
    await module('Question?');

    expect(module.__inquirerPrompt).toHaveBeenCalledWith([
      { name: 'answer', message: 'Question?' },
    ]);
  });
  it('should return the answer key', async () => {
    jest.spyOn(module, '__inquirerPrompt').mockReturnValue({ answer: 'foo' });

    const actual = await module('Question?');

    expect(actual).toEqual('foo');
  });
});

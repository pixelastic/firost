const module = jestImport('../prompt');
const inquirer = jestImport('inquirer');

describe('prompt', () => {
  beforeEach(() => {
    jest.spyOn(inquirer, 'prompt').mockReturnValue();
  });
  it('should ask the given question', async () => {
    await module('Question?');

    expect(inquirer.prompt).toHaveBeenCalledWith([
      { name: 'answer', message: 'Question?' },
    ]);
  });
  it('should return the answer key', async () => {
    jest.spyOn(inquirer, 'prompt').mockReturnValue({ answer: 'foo' });

    const actual = await module('Question?');

    expect(actual).toEqual('foo');
  });
});

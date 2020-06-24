const current = require('../consoleError');
const chalk = require('golgoth/lib/chalk');

describe('consoleError', () => {
  beforeEach(() => {
    jest.spyOn(console, 'info').mockReturnValue();
    jest.spyOn(chalk, 'red').mockReturnValue();
  });
  it('should be prefixed with red ✘', () => {
    chalk.red.mockReturnValue('red ✘');
    current('foo');

    expect(console.info).toHaveBeenCalledWith('red ✘', 'foo');
  });
});

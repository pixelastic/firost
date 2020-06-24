const current = require('../consoleSuccess');
const chalk = require('golgoth/lib/chalk');

describe('consoleSuccess', () => {
  beforeEach(() => {
    jest.spyOn(console, 'info').mockReturnValue();
    jest.spyOn(chalk, 'green').mockReturnValue();
  });
  it('should be prefixed with green ✔', () => {
    chalk.green.mockReturnValue('green ✔');
    current('foo');

    expect(console.info).toHaveBeenCalledWith('green ✔', 'foo');
  });
});

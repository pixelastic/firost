const current = require('../consoleInfo');
const chalk = require('golgoth/lib/chalk');

describe('consoleInfo', () => {
  beforeEach(() => {
    jest.spyOn(console, 'info').mockReturnValue();
    jest.spyOn(chalk, 'blue').mockReturnValue();
  });
  it('should be prefixed with blue •', () => {
    chalk.blue.mockReturnValue('blue •');
    current('foo');

    expect(console.info).toHaveBeenCalledWith('blue •', 'foo');
  });
});

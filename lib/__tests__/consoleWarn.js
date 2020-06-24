const current = require('../consoleWarn');
const chalk = require('golgoth/lib/chalk');

describe('consoleWarn', () => {
  beforeEach(() => {
    jest.spyOn(console, 'info').mockReturnValue();
    jest.spyOn(chalk, 'yellow').mockReturnValue();
  });
  it('should be prefixed with yellow ⚠', () => {
    chalk.yellow.mockReturnValue('yellow ⚠');
    current('foo');

    expect(console.info).toHaveBeenCalledWith('yellow ⚠', 'foo');
  });
});

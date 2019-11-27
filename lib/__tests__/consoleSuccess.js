import module from '../consoleSuccess';
import { chalk } from 'golgoth';

describe('consoleSuccess', () => {
  beforeEach(() => {
    jest.spyOn(console, 'info').mockReturnValue();
    jest.spyOn(chalk, 'green').mockReturnValue();
  });
  it('should be prefixed with green ✔', () => {
    chalk.green.mockReturnValue('green ✔');
    module('foo');

    expect(console.info).toHaveBeenCalledWith('green ✔', 'foo');
  });
});

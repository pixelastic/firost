import module from '../consoleInfo';
import { chalk } from 'golgoth';

describe('consoleInfo', () => {
  beforeEach(() => {
    jest.spyOn(console, 'info').mockReturnValue();
    jest.spyOn(chalk, 'blue').mockReturnValue();
  });
  it('should be prefixed with blue •', () => {
    chalk.blue.mockReturnValue('blue •');
    module('foo');

    expect(console.info).toHaveBeenCalledWith('blue •', 'foo');
  });
});
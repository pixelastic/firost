import module from '../consoleWarn';
import { chalk } from 'golgoth';

describe('consoleWarn', () => {
  beforeEach(() => {
    jest.spyOn(console, 'info').mockReturnValue();
    jest.spyOn(chalk, 'yellow').mockReturnValue();
  });
  it('should be prefixed with yellow ⚠', () => {
    chalk.yellow.mockReturnValue('yellow ⚠');
    module('foo');

    expect(console.info).toHaveBeenCalledWith('yellow ⚠', 'foo');
  });
});
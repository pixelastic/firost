import { chalk } from 'golgoth';

/**
 * Write an error log message
 * @param {string} text Text to display
 **/
export function consoleError(text) {
  console.info(chalk.red('✘'), text);
}

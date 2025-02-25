import { chalk } from 'golgoth';

/**
 * Write a warning log message
 * @param {string} text Text to display
 **/
export function consoleWarn(text) {
  console.info(chalk.yellow('⚠'), text);
}

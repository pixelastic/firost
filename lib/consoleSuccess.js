import { chalk } from 'golgoth';

/**
 * Write a success log message
 * @param {string} text Text to display
 **/
export function consoleSuccess(text) {
  console.info(chalk.green('✔'), text);
}

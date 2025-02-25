import { chalk } from 'golgoth';

/**
 * Write an information log message
 * @param {string} text Text to display
 **/
export function consoleInfo(text) {
  console.info(chalk.blue('•'), text);
}

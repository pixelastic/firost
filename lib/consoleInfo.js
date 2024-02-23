import { chalk } from 'golgoth';

/**
 * Write an information log message
 * @param {string} text Text to display
 **/
export default function (text) {
  console.info(chalk.blue('•'), text);
}

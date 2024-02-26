import { chalk } from 'golgoth';

/**
 * Write a success log message
 * @param {string} text Text to display
 **/
export default function (text) {
  console.info(chalk.green('✔'), text);
}
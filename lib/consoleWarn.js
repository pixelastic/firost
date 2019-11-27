import { chalk } from 'golgoth';

/**
 * Write a warning log message
 * @param {string} text Text to display
 **/
export default function(text) {
  console.info(chalk.yellow('⚠'), text);
}

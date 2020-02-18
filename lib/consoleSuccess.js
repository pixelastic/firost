import chalk from 'golgoth/lib/chalk';

/**
 * Write a success log message
 * @param {string} text Text to display
 **/
export default function(text) {
  console.info(chalk.green('✔'), text);
}

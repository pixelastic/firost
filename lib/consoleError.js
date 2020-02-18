import chalk from 'golgoth/lib/chalk';

/**
 * Write an error log message
 * @param {string} text Text to display
 **/
export default function(text) {
  console.info(chalk.red('✘'), text);
}

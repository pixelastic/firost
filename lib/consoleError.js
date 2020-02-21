const chalk = require('golgoth/lib/chalk');

/**
 * Write an error log message
 * @param {string} text Text to display
 **/
module.exports = function(text) {
  console.info(chalk.red('✘'), text);
};

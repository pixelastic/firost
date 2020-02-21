const chalk = require('golgoth/lib/chalk');

/**
 * Write a warning log message
 * @param {string} text Text to display
 **/
module.exports = function(text) {
  console.info(chalk.yellow('⚠'), text);
};

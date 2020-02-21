const chalk = require('golgoth/lib/chalk');

/**
 * Write a success log message
 * @param {string} text Text to display
 **/
module.exports = function(text) {
  console.info(chalk.green('✔'), text);
};

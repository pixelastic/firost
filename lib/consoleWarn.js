const chalk = require('golgoth/chalk');

/**
 * Write a warning log message
 * @param {string} text Text to display
 **/
module.exports = function (text) {
  console.info(chalk.yellow('⚠'), text);
};

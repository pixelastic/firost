const chalk = require('golgoth/chalk');

/**
 * Write an information log message
 * @param {string} text Text to display
 **/
module.exports = function (text) {
  console.info(chalk.blue('•'), text);
};

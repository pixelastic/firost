const ora = require('ora');
const chalk = require('golgoth/lib/chalk');

/**
 * Returns a spinner to display progress of any task
 * @param {number} max Max number of items to execute
 * @returns {object} Spinner object, coming with some methods:
 *  .tick(text) Increment the spinner by one and display the text
 *  .success(text) Stop the spinner and display a success message
 *  .failure(text) Stop the spinner and display an error message
 **/
module.exports = function(max = 0) {
  const spinner = ora();
  spinner.current = 0;
  spinner.max = max;
  spinner.start();

  return {
    spinner,
    /**
     * Format the text of the spinner to include the current step, the max
     * number of step and a custom message
     * @param {string} userText The text to display
     * @returns {string} The full message string
     **/
    text(userText) {
      let progressBar = '';
      if (this.spinner.max) {
        progressBar = `[${this.spinner.current}/${this.spinner.max}] `;
      }
      return `${progressBar}${userText}`;
    },
    /**
     * Increment the spinner by one, and also update the text if provided
     * @param {string} userText The text to display
     * @returns {object} Returns the spinner for chaining
     **/
    tick(userText) {
      this.spinner.current++;
      this.spinner.text = this.text(userText);
      return this;
    },
    /**
     * Succeed the internal spinner and display a green message.
     * @param {string} userText The text to display
     * @returns {object} Returns the spinner for chaining
     **/
    success(userText) {
      this.spinner.succeed(this.text(chalk.green(userText)));
      return this;
    },
    /**
     * Fail the internal spinner and display a red message.
     * @param {string} userText The text to display
     * @returns {object} Returns the spinner for chaining
     **/
    failure(userText) {
      this.spinner.fail(this.text(chalk.red(userText)));
      return this;
    },
    /**
     * Stop the internal spinner and display a blue message
     * @param {string} userText The text to display
     * @returns {object} Returns the spinner for chaining
     **/
    info(userText) {
      this.spinner.info(this.text(chalk.blue(userText)));
      return this;
    },
  };
};

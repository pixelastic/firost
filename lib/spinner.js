import ora from 'ora';
import colors from 'yoctocolors';
import { firostError } from './firostError.js';

export let __;

/**
 * Returns a spinner to display progress of any task
 * @param {number} max Max number of items to execute
 * @returns {object} Spinner object, coming with some methods:
 *  .tick(text) Increment the spinner by one and display the text
 *  .success(text) Stop the spinner and display a success message
 *  .failure(text) Stop the spinner and display an error message
 **/
export function spinner(max = 0) {
  let current = 0;

  const oraSpinner = ora().start();
  __.startListeningForCtrlC();

  /**
   * Format the text of the spinner to include the current step, the max
   * number of step and a custom message
   * @param {string} userText The text to display
   * @returns {string} The full message string
   **/
  function text(userText) {
    return max ? `[${current}/${max}] ${userText}` : userText;
  }

  return {
    /**
     * Increment the spinner by one, and also update the text if provided
     * @param {string} userText The text to display
     * @returns {object} Returns the spinner for chaining
     **/
    tick(userText) {
      current++;
      oraSpinner.text = text(userText);
      return this;
    },
    /**
     * Succeed the internal spinner and display a green message.
     * @param {string} userText The text to display
     * @returns {object} Returns the spinner for chaining
     **/
    success(userText) {
      __.stopListeningForCtrlC();
      oraSpinner.succeed(__.greenify(text(userText)));
      return this;
    },
    /**
     * Fail the internal spinner and display a red message.
     * @param {string} userText The text to display
     * @returns {object} Returns the spinner for chaining
     **/
    failure(userText) {
      __.stopListeningForCtrlC();
      oraSpinner.fail(__.redify(text(userText)));
      return this;
    },
    /**
     * Stop the internal spinner and display a blue message
     * @param {string} userText The text to display
     * @returns {object} Returns the spinner for chaining
     **/
    info(userText) {
      __.stopListeningForCtrlC();
      oraSpinner.info(__.blueify(text(userText)));
      return this;
    },
    // Expose the internal spinner for tests
    spinner: oraSpinner,
  };
}

__ = {
  startListeningForCtrlC() {
    process.stdin.on('data', __.stopOnCtrlC);
  },
  stopOnCtrlC: (data) => {
    if (data != '') return;
    throw firostError(
      'FIROST_SPINNER_CTRL_C',
      'User pressed Ctrl-C during spinner',
    );
  },
  stopListeningForCtrlC() {
    process.stdin.off('data', __.stopOnCtrlC);
  },
  greenify(text) {
    return colors.green(text);
  },
  redify(text) {
    return colors.red(text);
  },
  blueify(text) {
    return colors.blue(text);
  },
};

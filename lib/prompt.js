import { firostError } from 'firost';
import inquirerInput from '@inquirer/input';

/**
 * Interactively ask a question to the user
 * Pressing CTRL-C will throw an error
 * @param {string} message Label of the question
 * @param {object} userOptions Options to pass to prompt
 * @param {ReadableStream} userOptions.input The stdin stream
 * @returns {Promise} Resolved with the answer, reject with an error on CTRL-C
 */
export async function prompt(message, userOptions = {}) {
  // See https://github.com/SBoudrias/Inquirer.js/tree/main/packages/input
  const promptConfig = {
    message,
  };
  // See https://github.com/SBoudrias/Inquirer.js?tab=readme-ov-file#advanced-usage
  const runtimeConfig = {
    input: userOptions.input,
  };
  try {
    const response = await inquirerInput(promptConfig, runtimeConfig);
    return response;
  } catch (err) {
    if (err.name == 'ExitPromptError') {
      throw firostError(
        'FIROST_PROMPT_CTRL_C',
        'User pressed Ctrl-C during prompt',
      );
    }
    throw err;
  }
}

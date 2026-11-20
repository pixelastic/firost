import inquirerInput from '@inquirer/input';
import { firostError } from './firostError.js';

/**
 * Interactively ask a question to the user
 * Pressing CTRL-C will throw an error
 * @param {string} message Label of the question
 * @param {object} [options] Options
 * @param {string} [options.prefill] Value pre-typed in the input, that the user
 * can edit. Pressing Enter accepts it
 * @returns {Promise} Resolved with the answer, reject with an error on CTRL-C
 */
export async function prompt(message, options = {}) {
  const { prefill } = options;

  // See https://github.com/SBoudrias/Inquirer.js/tree/main/packages/input
  const promptConfig = {
    message,
  };
  if (prefill) {
    promptConfig.default = prefill;
    promptConfig.prefill = 'editable';
  }
  try {
    const response = await inquirerInput(promptConfig);
    return response;
  } catch (err) {
    if (err.name === 'ExitPromptError') {
      throw firostError(
        'FIROST_PROMPT_CTRL_C',
        'User pressed Ctrl-C during prompt',
      );
    }
    throw err;
  }
}

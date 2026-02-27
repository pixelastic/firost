import { firostError } from 'firost';
import inquirerInput from '@inquirer/input';

/**
 * Interactively ask a question to the user
 * Pressing CTRL-C will throw an error
 * @param {string} message Label of the question
 * @returns {Promise} Resolved with the answer, reject with an error on CTRL-C
 */
export async function prompt(message) {
  // See https://github.com/SBoudrias/Inquirer.js/tree/main/packages/input
  const promptConfig = {
    message,
  };
  try {
    const response = await inquirerInput(promptConfig);
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

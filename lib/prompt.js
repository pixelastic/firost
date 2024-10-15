import { input } from '@inquirer/prompts';
import firostError from './error.js';

/**
 * Interactively ask a question to the user
 * Pressing CTRL-C will throw an error
 * @param {string} message Label of the question
 * @returns {Promise} Resolved with the answer, reject with an error on CTRL-C
 */
export default async function (message) {
  // We catch Ctrl-C, to stop the prompt with a custom error
  const ctrlCKey = '\u0003';
  const controller = new AbortController();
  const cancelPromptOnCtrlC = (key) => {
    if (key == ctrlCKey) {
      process.stdin.off('data', cancelPromptOnCtrlC);
      controller.abort();
    }
  };
  process.stdin.on('data', cancelPromptOnCtrlC);

  try {
    return await input({ message }, { signal: controller.signal });
  } catch (err) {
    if (err.name == 'AbortPromptError') {
      throw firostError(
        'ERROR_PROMPT_CTRL_C',
        'User pressed Ctrl-C during prompt',
      );
    }
    throw err;
  }
}

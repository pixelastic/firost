import { input } from '@inquirer/prompts';
import firostError from './error.js';

/**
 * Interactively ask a question to the user
 * Pressing CTRL-C will throw an error
 * @param {string} message Label of the question
 * @param {object} options Options to pass to prompt
 * @param {ReadableStream} options.input The stdin stream
 * @param {WritableStream} options.output The stdout stream
 * @returns {Promise} Resolved with the answer, reject with an error on CTRL-C
 */
export default async function (message, options = {}) {
  const controller = new AbortController();
  const inputOptions = {
    ...options,
    signal: controller.signal,
  };
  const stdin = options.input || process.stdin;

  // We catch Ctrl-C, to stop the prompt with a custom error
  const ctrlCKey = '\u0003';
  const cancelPromptOnCtrlC = (key) => {
    if (key == ctrlCKey) {
      stdin.off('data', cancelPromptOnCtrlC);
      controller.abort();
    }
  };
  stdin.on('data', cancelPromptOnCtrlC);

  try {
    const response = await input({ message }, inputOptions);
    stdin.off('data', cancelPromptOnCtrlC);
    return response;
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

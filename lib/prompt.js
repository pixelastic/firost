import { firostError } from './firostError.js';

/**
 * Interactively ask a question to the user
 * Pressing CTRL-C will throw an error
 * @param {string} message Label of the question
 * @param {object} options Options to pass to prompt
 * @param {ReadableStream} options.input The stdin stream
 * @param {WritableStream} options.output The stdout stream
 * @returns {Promise} Resolved with the answer, reject with an error on CTRL-C
 */
export async function prompt(message, options = {}) {
  // Note: We dynamically load input here, as importing @inquirer/prompts
  // creates a new event listener automatically. We don't want to load too many
  // of those just for importing this file (or it will trigger
  // a MaxListenersExceededWarning), so we defer it when we actually need
  // it.
  const { input } = await import('@inquirer/prompts');

  const controller = new AbortController();
  const inputOptions = {
    ...options,
    signal: controller.signal,
  };
  const stdin = options.input || process.stdin;

  // We catch Ctrl-C, to stop the prompt with a custom error
  const ctrlCKey = '';
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

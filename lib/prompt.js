import { captureCtrlC, importFromInquirer } from './helpers/promptOrSelect.js';

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
  const input = await importFromInquirer('input');

  return await captureCtrlC({
    method: input,
    input: message,
    options,
    error: {
      code: 'FIROST_PROMPT_CTRL_C',
      message: 'User pressed Ctrl-C during prompt',
    },
  });
}

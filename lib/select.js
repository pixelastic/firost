import { _ } from 'golgoth';
import { captureCtrlC, importFromInquirer } from './helpers/promptOrSelect.js';

/**
 * Interactively present a list of choices to the user
 * Pressing CTRL-C will throw an error
 * @param {string} message Label of the question
 * @param {Array} userChoices List of choices (can be string[] or {label, value}[])
 * @param {object} options Options to pass to select
 * @param {ReadableStream} options.input The stdin stream
 * @param {WritableStream} options.output The stdout stream
 * @returns {Promise} Resolved with the selected value, reject with an error on CTRL-C
 */
export async function select(message, userChoices, options = {}) {
  const inquirerSelect = await importFromInquirer('select');

  // Normalize choices to {name, value} format
  const choices = userChoices.map((choice) => {
    if (_.isString(choice)) {
      return { name: choice, value: choice };
    }
    return choice;
  });

  return await captureCtrlC({
    method: inquirerSelect,
    input: { message, choices },
    options,
    error: {
      code: 'FIROST_SELECT_CTRL_C',
      message: 'User pressed Ctrl-C during prompt',
    },
  });
}

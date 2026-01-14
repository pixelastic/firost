import { _ } from 'golgoth';
import { firostError } from './firostError.js';

/**
 * Interactively present a list of choices to the user
 * Pressing CTRL-C will throw an error
 * @param {string} message Label of the question
 * @param {Array} choices List of choices (can be string[] or {label, value}[])
 * @param {object} options Options to pass to select
 * @param {ReadableStream} options.input The stdin stream
 * @param {WritableStream} options.output The stdout stream
 * @returns {Promise} Resolved with the selected value, reject with an error on CTRL-C
 */
export async function select(message, choices, options = {}) {
  // Note: We dynamically load select here, as importing @inquirer/prompts
  // creates a new event listener automatically. We don't want to load too many
  // of those just for importing this file (or it will trigger
  // a MaxListenersExceededWarning), so we defer it when we actually need
  // it.
  const { select: inquirerSelect } = await import('@inquirer/prompts');

  // Normalize choices to {name, value} format
  const normalizedChoices = choices.map((choice) => {
    if (_.isString(choice)) {
      return { name: choice, value: choice };
    }
    return choice;
  });

  const controller = new AbortController();
  const selectOptions = {
    ...options,
    signal: controller.signal,
  };
  const stdin = options.input || process.stdin;

  // We catch Ctrl-C, to stop the select with a custom error
  const ctrlCKey = '';
  const cancelSelectOnCtrlC = (key) => {
    if (key == ctrlCKey) {
      stdin.off('data', cancelSelectOnCtrlC);
      controller.abort();
    }
  };
  stdin.on('data', cancelSelectOnCtrlC);

  try {
    const response = await inquirerSelect(
      { message, choices: normalizedChoices },
      selectOptions,
    );
    stdin.off('data', cancelSelectOnCtrlC);
    return response;
  } catch (err) {
    if (err.name == 'AbortPromptError') {
      throw firostError(
        'FIROST_SELECT_CTRL_C',
        'User pressed Ctrl-C during select',
      );
    }
    throw err;
  }
}

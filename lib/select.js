import { _ } from 'golgoth';
import { firostError } from 'firost';
import inquirerSelect from '@inquirer/select';

/**
 * Interactively present a list of choices to the user
 * Pressing CTRL-C will throw an error
 * @param {string} message Label of the question
 * @param {Array} userChoices List of choices (can be string[] or {label, value}[])
 * @returns {Promise} Resolved with the selected value, reject with an error on CTRL-C
 */
export async function select(message, userChoices) {
  // Normalize choices to {name, value} format
  const choices = userChoices.map((choice) => {
    if (_.isString(choice)) {
      return { name: choice, value: choice };
    }
    return choice;
  });

  // See https://github.com/SBoudrias/Inquirer.js/tree/main/packages/select
  const promptConfig = {
    message,
    choices,
  };
  try {
    const response = await inquirerSelect(promptConfig);
    return response;
  } catch (err) {
    if (err.name == 'ExitPromptError') {
      throw firostError(
        'FIROST_SELECT_CTRL_C',
        'User pressed Ctrl-C during prompt',
      );
    }
    throw err;
  }
}

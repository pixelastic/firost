import inquirer from 'inquirer';
import { _ } from 'golgoth';
import firostError from './error.js';

/**
 * Interactively ask a question to the user Pressing CTRL-C will throw an error
 * @param {string} message Label of the question @returns {string} Answer given
 * @returns {Promise} Resolved with the answer, reject with an error on CTRL-C
 *
 * Note:
 * We want CTRL-C to stop the prompt and throw an error, but Inquirer catches
 * CTRL-C and stops the process. The usual way of overwriting
 * process.on('SIGINT') is not available as Inquirer has already caught it.
 *
 * Instead, we will have to dig into Inquirer's internals, and create the
 * Prompt UI ourselves, and listen to SIGINT on its internal readline.
 *
 * Source: https://github.com/SBoudrias/Inquirer.js/issues/405
 */
async function prompt(message) {
  const inquirerUI = prompt.__inquirerUI();
  const readline = prompt.__inquirerReadline(inquirerUI);

  // We expose the __readline so it can be accessed in tests
  // Note that it's a singleton, so all prompts will share the same readline. As
  // we should only have one prompt displayed at a time, it shouldn't be an
  // issue, though.
  prompt.__readline = readline;

  return new Promise((resolve, reject) => {
    // We add our custom handler on SIGINT instead, which will self-destruct,
    // close the UI and reject the wrapping Promise
    const handleCtrlC = () => {
      readline.off('SIGINT', handleCtrlC);
      inquirerUI.close();
      prompt.__addEmptyLine();
      reject(firostError('FIROST_PROMPT_CTRL_C'));
    };
    readline.on('SIGINT', handleCtrlC);

    // We now run the UI, and resolve with the answer
    inquirerUI
      .run([
        {
          name: 'answer',
          message,
        },
      ])
      .then((result) => {
        resolve(_.get(result, 'answer'));
      });
  });
}
/**
 * Creates an instance of the prompt UI displayed on screen
 * @returns {object} InquirerUI instance
 **/
prompt.__inquirerUI = () => {
  return new inquirer.ui.Prompt(inquirer.createPromptModule().prompts, {});
};
/**
 * Returns the readline of the given UI, stripped of all SIGINT listeners
 * @param {object} inquirerUI Inquirer UI generated above
 * @returns {object} Readline object
 **/
prompt.__inquirerReadline = (inquirerUI) => {
  const readline = inquirerUI.rl;

  // Remove all existing listeners
  readline
    .listeners('SIGINT')
    .forEach((listener) => readline.off('SIGINT', listener));

  return readline;
};
/**
 * Adds an empty line at the end of the prompt when cancelling it, otherwise
 * next content is added on the same line.
 * We wrap it in another method so we can easily mock it in tests
 **/
prompt.__addEmptyLine = () => {
  console.info('');
};

export default prompt;

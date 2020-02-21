const inquirer = require('inquirer');
const _ = require('golgoth/lib/_');

/**
 * Interactively ask a question to the user
 * @param {string} question Label of the question
 * @returns {string} Answer given
 **/
async function prompt(question) {
  const result = await prompt.__inquirerPrompt([
    { name: 'answer', message: question },
  ]);
  return _.get(result, 'answer');
}
prompt.__inquirerPrompt = inquirer.prompt;

module.exports = prompt;

import inquirer from 'inquirer';
import { _ } from 'golgoth';

/**
 * Interactively ask a question to the user
 * @param {string} question Label of the question
 * @returns {string} Answer given
 **/
const module = async function prompt(question) {
  const result = await inquirer.prompt([{ name: 'answer', message: question }]);
  return _.get(result, 'answer');
};
export default module;

import _which from 'which';
import { pify } from 'golgoth';
const which = pify(_which);

/**
 * Returns path to an executable, similar to unix which
 * @param {string} command Command to test
 * @returns {string|boolean} False if not found, otherwise path to executable
 **/
export default async function(command) {
  try {
    return await which(command);
  } catch (err) {
    return false;
  }
}

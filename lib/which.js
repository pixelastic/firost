import which from 'which';

/**
 * Returns path to an executable, similar to unix which
 * @param {string} command Command to test
 * @returns {string|boolean} False if not found, otherwise path to executable
 **/
export default async function (command) {
  try {
    return await which(command);
  } catch (_err) {
    return false;
  }
}

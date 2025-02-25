import whichModule from 'which';

/**
 * Returns path to an executable, similar to unix which
 * @param {string} command Command to test
 * @returns {string|boolean} False if not found, otherwise path to executable
 **/
export async function which(command) {
  try {
    return await whichModule(command);
  } catch (_err) {
    return false;
  }
}

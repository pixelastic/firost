const _which = require('which');
const pify = require('golgoth/lib/pify');
const which = pify(_which);

/**
 * Returns path to an executable, similar to unix which
 * @param {string} command Command to test
 * @returns {string|boolean} False if not found, otherwise path to executable
 **/
module.exports = async function(command) {
  try {
    return await which(command);
  } catch (err) {
    return false;
  }
};

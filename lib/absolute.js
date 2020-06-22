const untildify = require('untildify');
const path = require('path');
/**
 * Resolve a relative path to an absolute one
 * @param {string} filepath Relative filepath
 * @returns {string} Absolute filepath
 **/
module.exports = function(filepath) {
  return path.resolve(untildify(filepath));
};

const _ = require('golgoth/lib/_');
const shelljs = require('shelljs');
const error = require('./error');

/**
 * Run a command in the shell
 * @param {string} command Command to run
 * @returns {Promise} Resolves with stdout if exit code is 0, otherewise reject
 * with sterr
 **/
module.exports = async function shell(command) {
  return await new Promise((resolve, reject) => {
    const options = {
      async: true,
      silent: true,
    };

    shelljs.exec(command, options, (exitCode, stdout, stderr) => {
      // Success
      if (exitCode === 0) {
        resolve(_.trim(stdout));
        return;
      }
      // Failure
      reject(error(exitCode, _.trim(stderr)));
    });
  });
};

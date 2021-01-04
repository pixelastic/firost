const _ = require('golgoth/lodash');

/**
 * Wrapper to read environment variables, to make it easier to mock in tests
 * @param {string} name Environment variable name
 * @returns {string} Value of the environment variable
 **/
module.exports = (name) => {
  return _.get(process, `env.${name}`);
};

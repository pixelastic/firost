const read = require('./read');
const error = require('./error');

/**
 * Read a JSON file on disk and return its parsed content.
 * @param {string} source Path to the JSON file
 * @returns {Promise.<object>} The parsed content of the JSON file
 **/
module.exports = async function readJson(source) {
  const content = await read(source);
  try {
    return JSON.parse(content);
  } catch (err) {
    throw error('ERROR_NOT_JSON', `${source} is not a valid JSON file`);
  }
};

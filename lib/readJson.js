import read from './read';
import error from './error';

/**
 * Read a JSON file on disk and return its parsed content.
 * @param {String} source Path to the JSON file
 * @return {Promise.<Object>} The parsed content of the JSON file
 **/
const module = async function readJson(source) {
  const content = await read(source);
  try {
    return JSON.parse(content);
  } catch (err) {
    throw error('ERROR_NOT_JSON', `${source} is not a valid JSON file`);
  }
};

export default module;

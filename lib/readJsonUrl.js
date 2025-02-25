import { firostError } from './firostError.js';
import { readUrl } from './readUrl.js';

/**
 * Read a json url and return its parsed content
 * @param {string} inputUrl Url to the JSON content
 * @param {object} userOptions See readUrl options
 * @returns {Promise.<object>} The parsed content of the JSON file
 **/
export async function readJsonUrl(inputUrl, userOptions = {}) {
  const options = {
    memoryCache: true,
    diskCache: false,
    ...userOptions,
  };

  const rawContent = await readUrl(inputUrl, options);

  // Try to parse the JSON
  let value;
  try {
    value = JSON.parse(rawContent);
  } catch (_err) {
    throw firostError('ERROR_NOT_JSON', `${inputUrl} is not a valid JSON file`);
  }

  return value;
}

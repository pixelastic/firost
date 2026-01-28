import { firostError } from './firostError.js';
import { read } from './read.js';

/**
 * Read a JSON file on disk and return its parsed content.
 * @param {string} source Path to the JSON file
 * @returns {Promise.<object>} The parsed content of the JSON file
 **/
export async function readJson(source) {
  const content = await read(source);
  try {
    return JSON.parse(content);
  } catch (_err) {
    throw firostError(
      'FIROST_READ_JSON_NOT_JSON',
      `${source} is not a valid JSON file`,
    );
  }
}

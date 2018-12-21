import got from 'got';
import error from './error';

/**
 * Read a json url and return its parsed content
 * @param {String} inputUrl Url to the JSON content
 * @return {Promise.<Object>} The parsed content of the Json file
 **/
const module = async function readJsonUrl(inputUrl) {
  let response;

  // Try to download the file
  try {
    response = await got(inputUrl);
  } catch (err) {
    const errorCode = `HTTP_ERROR_${err.statusCode}`;
    const errorMessage = `${inputUrl}: ${err.statusCode} ${err.statusMessage}`;
    throw error(errorCode, errorMessage);
  }

  // Try to parse the JSON
  try {
    return JSON.parse(response.body);
  } catch (err) {
    throw error('ERROR_NOT_JSON', `${inputUrl} is not a valid JSON file`);
  }
};

export default module;

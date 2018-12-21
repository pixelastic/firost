import stringify from 'json-stable-stringify';
import write from './write';

/**
 * Writes an object to JSON on disk
 * @param {Object} data Object to convert to json and write to disk
 * @param {String} destination Filepath to write the file to
 * @returns {Void}
 **/
const module = async function writeJson(data, destination) {
  const content = stringify(data, { space: 2 });
  await write(content, destination);
};
export default module;

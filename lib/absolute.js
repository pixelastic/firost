import untildify from 'untildify';
import path from 'path';
/**
 * Resolve a relative path to an absolute one
 * @param {string} filepath Relative filepath
 * @returns {string} Absolute filepath
 *
 * TODO: Should also accept an argument to specific the cwd
 * TODO: Should also accept an array of filenames as input, and output an array
 * as well
 **/
export default function (filepath) {
  return path.resolve(untildify(filepath));
}

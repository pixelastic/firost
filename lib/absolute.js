import untildify from 'untildify';
import path from 'path';
/**
 * Resolve a relative path to an absolute one
 * @param {string} filepath Relative filepath
 * @returns {string} Absolute filepath
 **/
export default function (filepath) {
  return path.resolve(untildify(filepath));
}

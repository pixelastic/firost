import path from 'path';
import untildify from 'untildify';
import callsites from 'callsites';
import { _ } from 'golgoth';
import gitRoot from './gitRoot/gitRootWithoutArgument.js';
import packageRoot from './packageRoot/packageRootWithoutArgument.js';

/**
 * Resolve a relative path to an absolute one
 * @param {...any} args List of filepath parts
 * @returns {string} Absolute filepath
 *
 * Note: Defaults to the caller script if no argument passed
 **/
export default function (...args) {
  const callerScript = callsites()[1].getFileName();

  // If no path specified, return the path to the caller script
  if (args.length == 0) {
    return callerScript;
  }

  let fullPath = args.join('/');

  // Tilde path
  if (fullPath[0] == '~') {
    fullPath = untildify(fullPath);
  }

  // <prefix>
  if (_.includes(fullPath, '<gitRoot>')) {
    fullPath = _.replace(fullPath, '<gitRoot>', gitRoot());
  }
  if (_.includes(fullPath, '<packageRoot>')) {
    fullPath = _.replace(fullPath, '<packageRoot>', packageRoot());
  }
  if (_.includes(fullPath, '<cwd>')) {
    fullPath = _.replace(fullPath, '<cwd>', process.cwd);
  }

  // Relative path
  if (fullPath[0] != '/') {
    fullPath = path.resolve(path.dirname(callerScript), fullPath);
  }

  // Absolute path
  return path.resolve(fullPath);

  // // If starts with ".", it should be treated as a path relative to the caller
  // // script
  // if (_.startsWith(filepath, '.')) {
  //   return path.resolve(path.dirname(callerScript), filepath);
  // }

  // // Generic flattening of a long relative path, into an absolute one
  // return path.resolve(untildify(filepath));
}

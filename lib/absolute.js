import path from 'node:path';
import untildify from 'untildify';
import { _ } from 'golgoth';
import { userlandCaller } from './userlandCaller.js';
import { packageRoot } from './packageRoot/index.js';
import { gitRoot } from './gitRoot/index.js';

/**
 * Resolve and normalize filepaths
 * @param {...any} args List of filepath parts
 * @returns {string} Absolute filepath
 *
 * Examples:
 * absolute()                              Current directory, same as dirname()
 * absolute('./path/to/file');             Absolute path, from the current file
 * absolute('.', 'path', 'to', 'file')     Converts fragments to absolute
 * absolute('<packageRoot>/path/to/file')  Convert placeholders
 *
 **/
export function absolute(...args) {
  const callerPath = userlandCaller();

  // If no path specified, return the path to the caller script
  if (args.length == 0) {
    return callerPath;
  }

  // Join all args
  let fullPath = args.join('/');

  // Tilde path
  if (fullPath[0] == '~') {
    fullPath = untildify(fullPath);
  }

  // <packageRoot> placeholder
  if (_.startsWith(fullPath, '<packageRoot>')) {
    fullPath = _.replace(fullPath, '<packageRoot>', packageRoot(callerPath));
  }
  // <gitRoot> placeholder
  if (_.startsWith(fullPath, '<gitRoot>')) {
    fullPath = _.replace(fullPath, '<gitRoot>', gitRoot(callerPath));
  }

  // Relative path
  if (fullPath[0] != '/') {
    const calledDirname = path.dirname(callerPath);
    fullPath = `${calledDirname}/./${fullPath}`;
  }

  return path.resolve(fullPath);
}

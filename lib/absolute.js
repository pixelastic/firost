import path from 'node:path';
import untildify from 'untildify';
import { _ } from 'golgoth';
import { userlandCaller } from './userlandCaller.js';
import { packageRootWithoutArgument } from './packageRoot/packageRootWithoutArgument.js';
import { gitRootWithoutArgument } from './gitRoot/gitRootWithoutArgument.js';

/**
 * Resolve and normalize filepaths
 * @param {...any} args List of filepath parts
 * @returns {string} Absolute filepath
 *
 * Examples:
 * absolute()                              Current filepath
 * absolute('./path/to/file');             Converts relative to absolute
 * absolute('.', 'path', 'to', 'file')     Converts fragments to absolute
 * absolute('<packageRoot>/path/to/file')  Convert shortcuts
 *
 **/
export function absolute(...args) {
  // If no path specified, return the path to the caller script
  if (args.length == 0) {
    return userlandCaller();
  }

  let fullPath = args.join('/');

  // Tilde path
  if (fullPath[0] == '~') {
    fullPath = untildify(fullPath);
  }

  // Shortcuts
  if (_.includes(fullPath, '<cwd>')) {
    fullPath = _.replace(fullPath, '<cwd>', process.cwd);
  }
  if (_.includes(fullPath, '<packageRoot>')) {
    fullPath = _.replace(
      fullPath,
      '<packageRoot>',
      packageRootWithoutArgument(),
    );
  }
  if (_.includes(fullPath, '<gitRoot>')) {
    fullPath = _.replace(fullPath, '<gitRoot>', gitRootWithoutArgument());
  }

  // Relative path
  if (fullPath[0] != '/') {
    const dirname = path.dirname(userlandCaller());
    fullPath = `${dirname}/./${fullPath}`;
  }

  return path.resolve(fullPath);
}

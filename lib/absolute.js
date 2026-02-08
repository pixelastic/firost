import path from 'node:path';
import { _ } from 'golgoth';
import untildify from 'untildify';
import { caller } from './caller.js';
import { userlandCaller } from './userlandCaller.js';

/**
 * Resolve and normalize filepaths
 * @param {...any} userArgs List of filepath parts
 * @returns {string} Absolute filepath
 *
 * Examples:
 * absolute()                              Current file, same as here()
 * absolute('.')                           Current directory, same as dirname()
 * absolute('./path/to/file');             Absolute path, from the current file
 * absolute('.', 'path', 'to', 'file')     Converts fragments to absolute
 * absolute('./path', { cwd: '/base' })    Absolute path from custom cwd
 *
 **/
export function absolute(...userArgs) {
  let options = {};
  let args = userArgs;

  // No argument, default to current file
  if (_.isEmpty(args)) {
    return userlandCaller();
  }

  // Allow passing a last argument as options object
  const lastArg = _.last(userArgs);
  if (_.isPlainObject(lastArg)) {
    options = lastArg;
    args = userArgs.slice(0, -1);
  }

  // Join all args
  let fullPath = args.join('/');

  // Tilde path
  if (fullPath[0] == '~') {
    fullPath = untildify(fullPath);
  }

  // Absolute path
  if (fullPath[0] == '/') {
    return path.resolve(fullPath);
  }

  // Relative path
  const cwd = options.cwd || path.dirname(caller());
  return path.resolve(cwd, fullPath);
}

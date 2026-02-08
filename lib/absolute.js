import path from 'node:path';
import untildify from 'untildify';
import { userlandCaller } from './userlandCaller.js';

/**
 * Resolve and normalize filepaths
 * @param {...any} args List of filepath parts
 * @returns {string} Absolute filepath
 *
 * Examples:
 * absolute()                              Current file, same as here()
 * absolute('.')                           Current directory, same as dirname()
 * absolute('./path/to/file');             Absolute path, from the current file
 * absolute('.', 'path', 'to', 'file')     Converts fragments to absolute
 *
 **/
export function absolute(...args) {
  // Note: We could have saved userlandCaller() into a variable and used it in
  // several places. The problem with that is that userlandCalled() can throw if
  // there is no userland, so it's better to only call it when we really need
  // it.

  // If no path specified, return the path to the caller script
  if (args.length == 0) {
    return userlandCaller();
  }

  // Join all args
  let fullPath = args.join('/');

  // Tilde path
  if (fullPath[0] == '~') {
    fullPath = untildify(fullPath);
  }

  // Relative path
  if (fullPath[0] != '/') {
    const calledDirname = path.dirname(userlandCaller());
    fullPath = `${calledDirname}/./${fullPath}`;
  }

  return path.resolve(fullPath);
}

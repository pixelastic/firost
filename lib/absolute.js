import path from 'node:path';
import { _ } from 'golgoth';
import untildify from 'untildify';
import { firostError } from './firostError.js';
import { gitRoot } from './gitRoot.js';
import { packageRoot } from './packageRoot.js';
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
 * absolute('<packageRoot>/path/to/file')  Convert placeholders
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

  // <packageRoot> placeholder
  if (_.startsWith(fullPath, '<packageRoot>')) {
    const packageRootPath = packageRoot(userlandCaller());
    if (!packageRootPath) {
      throw firostError(
        'FIROST_ABSOLUTE_NO_PACKAGE_ROOT',
        'Cannot resolve <packageRoot> placeholder: caller is not inside a package',
      );
    }

    fullPath = _.replace(fullPath, '<packageRoot>', packageRootPath);
  }

  // <gitRoot> placeholder
  if (_.startsWith(fullPath, '<gitRoot>')) {
    const gitRootPath = gitRoot(userlandCaller());
    if (!gitRootPath) {
      throw firostError(
        'FIROST_ABSOLUTE_NO_GIT_ROOT',
        'Cannot resolve <gitRoot> placeholder: caller is not inside a git directory',
      );
    }
    fullPath = _.replace(fullPath, '<gitRoot>', gitRootPath);
  }

  // Relative path
  if (fullPath[0] != '/') {
    const calledDirname = path.dirname(userlandCaller());
    fullPath = `${calledDirname}/./${fullPath}`;
  }

  return path.resolve(fullPath);
}

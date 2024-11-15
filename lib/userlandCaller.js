import path from 'path';
import { findUpSync } from 'find-up';
import { _ } from 'golgoth';
import callstack from './callstack.js';
import here from './here.js';

/**
 * Returns the full path to the first entry in the callstack outside firost
 *
 * Note: This is used internally by firost, to serve as a reference point for
 * methods like here(), dirname(), caller(), etc, but shouldn't be used outside
 * directly.
 *
 * @returns {string} Filepath to the first file in userland calling the current
 * callstack
 **/
export default function userlandCaller() {
  const currentStack = callstack();

  // Note: We do have a method called packageRoot, that does pretty much the
  // same thing. But we can't use it, otherwise it will create cycling
  // dependencies as it depends on userlandCaller itself. So we revert to some
  // good old copy-paste for this simple extraction here
  const modulePackageRoot = path.dirname(
    findUpSync('package.json', {
      cwd: path.dirname(here()),
    }),
  );

  return _.chain(currentStack)
    .map('filepath')
    .find((filepath) => {
      return !_.includes(filepath, modulePackageRoot);
    })
    .value();
}

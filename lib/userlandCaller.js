import path from 'node:path';
import { _ } from 'golgoth';
import { up as packageUp } from 'empathic/package';
import { callstack } from './callstack.js';
// import { here } from './here.js';
import { dirname } from './dirname.js';
import { firostError } from './firostError.js';

/**
 * Returns the full path to the first entry in the callstack outside firost
 *
 * @returns {string} Filepath to the first file in userland calling the current
 * callstack
 **/
export function userlandCaller() {
  const firostRoot = path.dirname(packageUp({ cwd: dirname() }));
  const result = _.chain(callstack())
    .map('filepath')
    .find((filepath) => {
      return !_.startsWith(filepath, firostRoot);
    })
    .value();

  if (!result) {
    throw firostError(
      'FIROST_USERLAND_CALLER_NO_CALLER',
      [
        'Unable to find a caller in userland.',
        'Note: _.map() sometimes prevents accessing the userlandCaller()',
        JSON.stringify(callstack(), null, 2),
      ].join('\n'),
    );
  }

  return result;

  // // Note: We do have a method called packageRoot, that does pretty much the
  // // same thing. But we can't use it, otherwise it will create cycling
  // // dependencies as it depends on userlandCaller itself. So we revert to some
  // // good old copy-paste for this simple extraction here
  // const modulePackageRoot = path.dirname(
  //   packageUp({
  //     cwd: path.dirname(here()),
  //   }),
  // );
  //
  // const result = _.chain(currentStack)
  //   .map('filepath')
  //   .find((filepath) => {
  //     return !_.includes(filepath, modulePackageRoot);
  //   })
  //   .value();
  //
  //
  // return result;
}

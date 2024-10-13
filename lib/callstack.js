import * as url from 'url';
import callsites from 'callsites';
import { _ } from 'golgoth';

/**
 * Normalize a filepath, as returned by callsite()
 * It sometimes contains a file:// prefix, when referencing  a file taken from
 * a node_modules
 * @param {string} input Input filepath
 * @returns {string} Normalized filepath
 */
function normalizeFilepath(input) {
  if (!input.startsWith('file://')) {
    return input;
  }
  return url.fileURLToPath(new URL('.', input));
}

/**
 * Returns an array of the callstack filepaths
 * @param {number} depth Callstack depth. If empty, returns the full callstack
 * @returns {Array | object} Callstack array or one element. Contains the .filepath and
 * .function keys
 **/
export default function (depth) {
  const rawCallsites = _.tail(callsites());

  // If a specific depth if given, we return only that one
  if (depth != undefined) {
    const specificCallsite = rawCallsites[depth];
    const filepath = normalizeFilepath(specificCallsite.getFileName());
    const functionName = specificCallsite.getFunctionName();
    return {
      filepath,
      function: functionName,
    };
  }

  // The full callstack otherwise

  return _.map(rawCallsites, (entry) => {
    const filepath = normalizeFilepath(entry.getFileName());
    const functionName = entry.getFunctionName();

    return {
      filepath,
      function: functionName,
    };
  });
}

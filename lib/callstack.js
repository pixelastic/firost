import { getCallSites } from 'node:util';
import { _ } from 'golgoth';

/**
 * Returns an array of the callstack filepaths
 * @param {number} depth Callstack depth. If empty, returns the full callstack
 * @returns {Array | object} Callstack array or one element. Contains the .filepath and
 * .function keys
 **/
export function callstack(depth) {
  const rawCallsites = _.tail(getCallSites());

  // If a specific depth if given, we return only that one
  if (depth != undefined) {
    const specificCallsite = rawCallsites[depth];
    const filepath = normalizeFilepath(specificCallsite.scriptName);
    const functionName = specificCallsite.functionName;
    return {
      filepath,
      function: functionName,
    };
  }

  // The full callstack otherwise
  return _.chain(rawCallsites)
    .map((entry) => {
      const { scriptName, functionName } = entry;

      // Skip entries without a name
      if (!scriptName) {
        return false;
      }
      // Skip internal node stacks
      if (_.startsWith(scriptName, 'node:')) {
        return false;
      }
      const filepath = normalizeFilepath(scriptName);

      return {
        filepath,
        function: functionName,
      };
    })
    .compact()
    .value();
}

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

  return input.replace(/^file:\/\//, '');
}

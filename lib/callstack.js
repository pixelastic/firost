import * as url from 'url';
import callsites from 'callsites';
import { _ } from 'golgoth';

/**
 * Returns an array of the callstack filepaths
 * @returns {Array} Callstack array. Each element contains the .filepath and
 * .function keys
 **/
export default function () {
  return _.chain(callsites())
    .map((entry) => {
      let filepath = entry.getFileName();

      // Converts file:// paths to regular paths
      if (filepath.startsWith('file://')) {
        filepath = url.fileURLToPath(new URL('.', filepath));
      }

      const functionName = entry.getFunctionName();

      return {
        filepath,
        function: functionName,
      };
    })
    .tail()
    .value();
}

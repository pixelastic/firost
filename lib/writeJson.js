import stableStringify from 'json-stable-stringify';
import { _ } from 'golgoth';
import { write } from './write.js';
import { firostImport } from './firostImport.js';
import { firostError } from './firostError.js';

export const __ = {
  getPrettier,
};

/**
 * Writes an object to JSON on disk
 * @param {object} what Object to convert to json and write to disk
 * @param {string} where Filepath to write the file to
 * @param {object} userOptions Options to change behavior.
 * - sort {Boolean|Array} (default: true) If true, keys will be sorted
 *   alphabetically. If an array, keys will be ordered according to the array,
 *   with remaining keys appended alphabetically at the end.
 **/
export async function writeJson(what, where, userOptions = {}) {
  // Detect if arguments are swapped
  if (_.isObject(where)) {
    throw firostError(
      'ERROR_WRITEJSON_SWAPPED_ARGUMENTS',
      'writeJson: Arguments appear to be swapped. ' +
        'Signature is writeJson(content, filepath) not writeJson(filepath, content)',
    );
  }

  // Do nothing if no content to write
  if (what === undefined) {
    return;
  }

  const options = {
    sort: true,
    ...userOptions,
  };

  // Generate content based on sort option
  let content;
  if (options.sort) {
    const stringifyOptions = { space: 2 };
    if (_.isArray(options.sort)) {
      stringifyOptions.cmp = getComparisonFunction(options.sort);
    }
    content = stableStringify(what, stringifyOptions);
  } else {
    // No sorting - use regular JSON.stringify
    content = JSON.stringify(what, null, 2);
  }

  // Try to prettify it if prettier is available
  const prettier = await __.getPrettier();
  if (prettier) {
    content = await prettier.format(content, { parser: 'json' });
  }

  // Write to disk
  await write(content, where);
}

/**
 * Returns Prettier if available
 * @returns {object} Prettier module
 */
async function getPrettier() {
  try {
    return await firostImport('prettier');
  } catch (_err) {
    return null;
  }
}

/**
 * Create a custom comparator function for json-stable-stringify
 * @param {Array} keyOrder Array of keys defining the preferred order
 * @returns {Function} Comparator function for json-stable-stringify
 */
function getComparisonFunction(keyOrder) {
  return function (a, b) {
    const indexA = keyOrder.indexOf(a.key);
    const indexB = keyOrder.indexOf(b.key);

    // If both keys are in the custom order, sort by their position
    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB;
    }

    // If only A is in custom order, A comes first
    if (indexA !== -1) {
      return -1;
    }

    // If only B is in custom order, B comes first
    if (indexB !== -1) {
      return 1;
    }

    // If neither is in custom order, sort alphabetically
    return a.key.localeCompare(b.key);
  };
}

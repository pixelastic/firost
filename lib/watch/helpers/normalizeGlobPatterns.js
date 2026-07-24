import path from 'node:path';
import { _ } from 'golgoth';

/**
 * Normalize glob patterns to absolute paths
 * @param {string|Array} userInput Glob pattern(s) to normalize
 * @param {string} baseDir Base directory to resolve relative paths from
 * @param baseDirectory
 * @returns {Array} Array of absolute glob patterns
 **/
export function normalizeGlobPatterns(userInput, baseDirectory) {
  return _.chain(userInput)
    .castArray()
    .map((pattern) => {
      const isNegation = pattern.startsWith('!');
      let rawInput = pattern;

      if (isNegation) {
        rawInput = pattern.slice(1);
      }

      const absolutePath = path.resolve(baseDirectory, rawInput);

      if (isNegation) {
        return '!' + absolutePath;
      }

      return absolutePath;
    })
    .value();
}

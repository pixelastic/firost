import path from 'node:path';
import { _ } from 'golgoth';

/**
 * Normalize glob patterns to absolute paths
 * @param {string|Array} userInput Glob pattern(s) to normalize
 * @param {string} baseDir Base directory to resolve relative paths from
 * @returns {Array} Array of absolute glob patterns
 **/
export function normalizeGlobPatterns(userInput, baseDir) {
  return _.chain(userInput)
    .castArray()
    .map((pattern) => {
      const isNegation = pattern.startsWith('!');
      let rawInput = pattern;

      if (isNegation) {
        rawInput = pattern.slice(1);
      }

      const absolutePath = path.resolve(baseDir, rawInput);

      if (isNegation) {
        return '!' + absolutePath;
      }

      return absolutePath;
    })
    .value();
}

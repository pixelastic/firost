import { _, pMap, pMapSeries } from 'golgoth';
import exists from '../exists.js';

/**
 * Fix patterns because of a limitation of chokidar (tested on 3.2.1)
 * The issue is that listening to named directories that don't yet exist won't
 * trigger events when a file is created inside of them. Listening to glob
 * directories works perfectly though.
 * For example listening to ./foo/bar.json won't work if ./foo/ does not exist,
 * but listening to ./*\/bar.json will work.
 * The trick/hack is to turn any named directory that doesn't exist in the
 * pattern into a glob. We replace /foo/ with /(foo|?!)/ that matches exactly
 * the same folders.
 * See: https://github.com/paulmillr/chokidar/issues/872
 * @param {string|Array} userPattern Glob pattern to match
 * @returns {string|Array} Fixed pattern
 **/
async function fixPattern(userPattern) {
  if (_.isArray(userPattern)) {
    return await pMap(userPattern, fixPattern);
  }

  let pattern = userPattern;

  const isNegated = _.startsWith(pattern, '!');
  let negationPrefix = isNegated ? '!' : '';
  pattern = _.replace(pattern, /^!/, '');

  const isAbsolute = _.startsWith(pattern, '/');
  const pathPrefix = isAbsolute ? '/' : '';

  const splitPath = _.compact(pattern.split('/'));
  const newPath = [];

  // We rebuild the path, part by part, and replace non-existing dirs with
  // regexp that matches them
  await pMapSeries(splitPath, async (pathPart, index) => {
    const partIsGlob = _.includes(pathPart, '*');
    const isLastPart = index === splitPath.length - 1;
    // Nothing to change if the part is a glob or the last part
    if (isLastPart || partIsGlob) {
      newPath.push(pathPart);
      return;
    }

    // Checking if such a path exists
    const concatPath = _.concat(newPath, pathPart).join('/');
    const iterativePath = `${pathPrefix}${concatPath}`;
    const iterativePathExists = await exists(iterativePath);
    // Nothing to change if it does
    if (iterativePathExists) {
      newPath.push(pathPart);
      return;
    }

    // We replace the path with a regexp that matches the same thing
    newPath.push(`(${pathPart}|$*)`);
  });

  return `${negationPrefix}${pathPrefix}${newPath.join('/')}`;
}

export default fixPattern;

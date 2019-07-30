import chokidar from 'chokidar';
import cache from './cache';
import { _, pMapSeries } from 'golgoth';
import exists from './exists';

/**
 * Fix patterns because of a limitation of chokidar 3.0.2
 * The issue is that listening to named directories that don't yet exist won't
 * trigger events when a file is created inside of them. Listening to glob
 * directories works perfectly though.
 * For example listening to ./foo/bar.json won't work if ./foo/ does not exist,
 * but listening to ./*\/bar.json will work.
 * The trick/hack is to turn any named directory that doesn't exist in the
 * pattern into a glob. We replace /foo/ with /(foo|?!)/ that matches exactly
 * the same folders.
 * @param {string|Array} pattern Glob pattern to match
 * @returns {string|Array} Fixed pattern
 **/
async function fixPattern(pattern) {
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
    const iterativePath = `/${_.concat(newPath, pathPart).join('/')}`;
    const iterativePathExists = await exists(iterativePath);
    // Nothing to change if it does
    if (iterativePathExists) {
      newPath.push(pathPart);
      return;
    }

    // We replace the path with a regexp that matches the same thing
    newPath.push(`(${pathPart}|$*)`);
  });

  return `/${newPath.join('/')}`;
}

/**
 * Watch for file changes, and execute specified callback on changed files
 * @param {string|Array} pattern Glob pattern to match
 * @param {Function} callback Method to call on each changed file
 * @param {string} userWatcherName Optional name for the watcher, to call * unwatch(watcherName) to kill it
 * @returns {Promise} The ready watcher
 * Known issues:
 * - Listing to changes in a directory that does not yet exist won't trigger
 *   See: https://github.com/paulmillr/chokidar/issues/462
 **/
const module = async function watch(
  pattern,
  callback = function() {},
  userWatcherName = ''
) {
  const fixedPattern = await fixPattern(pattern);
  return await new Promise(resolve => {
    const watcher = chokidar.watch(fixedPattern, { ignoreInitial: true });
    // Force passing the type as second argument
    const wrapCallback = function(initialCallback, type) {
      const method = async function(file) {
        // Flag the watcher as currently running when calling the callback
        // This will be checked by waitForWatchers to wait until all watchers
        // are done
        const cacheKey = `watchers.${watcherName}.isRunning`;
        cache.write(cacheKey, true);
        await initialCallback(file, type);
        cache.write(cacheKey, false);
      };
      return method;
    };

    // Pick a name for this watcher
    let watcherName;
    if (_.isEmpty(userWatcherName)) {
      const watcherCounter = cache.read('watcherCounter', 0) + 1;
      watcherName = `watcher_${watcherCounter}`;
      cache.write('watcherCounter', watcherCounter);
    } else {
      watcherName = userWatcherName;
    }

    // Storing some data about the watcher in cache
    const watcherData = {
      name: watcherName,
      watcher,
      pattern,
      isRunning: false,
    };
    // And reference to the cache key in the watcher itself
    watcher.firostName = watcherName;

    watcher
      .on('add', wrapCallback(callback, 'created'))
      .on('change', wrapCallback(callback, 'modified'))
      .on('unlink', wrapCallback(callback, 'removed'))
      .on('ready', () => {
        // Save the watcher in cache, so we can kill it with unwatch() later
        cache.write(`watchers.${watcherName}`, watcherData);

        // We wait at least one cycle before returning
        setTimeout(() => {
          resolve(watcher);
        }, watcher.options.interval * 1.2);
      });
  });
};

export default module;

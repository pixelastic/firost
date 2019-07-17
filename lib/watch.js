import chokidar from 'chokidar';
import cache from './cache';
import { _ } from 'golgoth';

/**
 * Watch for file changes, and execute specified callback on changed files
 * @param {string} pattern Glob pattern to match
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
  return await new Promise(resolve => {
    const watcher = chokidar.watch(pattern, { ignoreInitial: true });
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
        resolve(watcher);
      });
  });
};

export default module;

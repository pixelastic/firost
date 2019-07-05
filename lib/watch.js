import chokidar from 'chokidar';
import cache from './cache';
import { _ } from 'golgoth';

/**
 * Watch for file changes, and execute specified callback on changed files
 * @param {string} pattern Glob pattern to match
 * @param {Function} callback Method to call on each changed file
 * @param {string} userWatcherName Optional name for the watcher, to call * unwatch(watcherName) to kill it
 * @returns {Promise} The ready watcher
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
      return function(file) {
        initialCallback(file, type);
      };
    };

    // Pick a name for this watcher
    let watcherName;
    if (_.isEmpty(userWatcherName)) {
      const watcherCounter = cache.read('watcherCounter', 0) + 1;
      watcherName = `watcher_${watcherCounter}`;
      cache.write(watcherCounter, 'watcherCounter');
    } else {
      watcherName = userWatcherName;
    }

    // Storing some data in the watcher
    watcher.firostData = {
      name: watcherName,
      pattern,
    };

    watcher
      .on('add', wrapCallback(callback, 'created'))
      .on('change', wrapCallback(callback, 'modified'))
      .on('unlink', wrapCallback(callback, 'removed'))
      .on('ready', () => {
        // Save the watcher in cache, so we can kill it with unwatch() later
        cache.write(watcher, `watchers.${watcherName}`);
        resolve(watcher);
      });
  });
};

export default module;

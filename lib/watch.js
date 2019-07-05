import chokidar from 'chokidar';
import cache from './cache';
import { _ } from 'golgoth';

/**
 * Watch for file changes, and execute specified callback on changed files
 * @param {string} pattern Glob pattern to match
 * @param {Function} callback Method to call on each changed file
 * @param {string} watcherName Optional name for the watcher, to call * unwatch(watcherName) to kill it
 * @returns {Promise} The ready watcher
 **/
const module = async function watch(
  pattern,
  callback = function() {},
  watcherName = ''
) {
  return await new Promise(resolve => {
    const watcher = chokidar.watch(pattern, { ignoreInitial: true });
    // Force passing the type as second argument, and debounce
    const wrapCallback = function(initialCallback, type) {
      return function(file) {
        initialCallback(file, type);
      };
    };

    // Calling .kill() on the watcher will close it. This is used internally by
    // the unwatch() method
    watcher.__kill = async function() {
      watcher.unwatch(pattern);
      watcher.close();
    };

    // Wait for the watcher to have been up for at least one cycle. This will
    // help in tests to make sure we have time to register the
    // create/modified/deleted events before asserting the tests
    watcher.__forceWaitOneCycle = async function() {
      return await new Promise(waitResolve => {
        setTimeout(waitResolve, watcher.options.interval * 1.2);
      });
    };

    watcher
      .on('add', wrapCallback(callback, 'created'))
      .on('change', wrapCallback(callback, 'modified'))
      .on('unlink', wrapCallback(callback, 'removed'))
      .on('ready', () => {
        // Save the watcher in cache, so we can kill it with unwatch() or
        // unwatchAll()
        if (_.isEmpty(watcherName)) {
          const rawWatchers = cache.read('watchers.raw', []);
          rawWatchers.push(watcher);
          cache.write(rawWatchers, 'watchers.raw');
        } else {
          cache.write(watcher, `watchers.named.${watcherName}`);
        }

        resolve(watcher);
      });
  });
};

export default module;

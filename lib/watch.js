import chokidar from 'chokidar';

/**
 * Watch for file changes, and execute specified callback on changed files
 * @param {string} pattern Glob pattern to match
 * @param {Function} callback Method to call on each changed file
 * @returns {void}
 **/
const module = async function watch(pattern, callback = function() {}) {
  return await new Promise(resolve => {
    const watcher = chokidar.watch(pattern, { ignoreInitial: true });
    // Force passing the type as second argument, and debounce
    const wrapCallback = function(initialCallback, type) {
      return function(file) {
        initialCallback(file, type);
      };
    };

    // Calling .kill() on the watcher will close it. We delay it a bit, to allow
    // it to run at least one polling interval circle. This is mostly used for
    // tests that watch/unwatch in quick consecutive order. Here, we wait
    // 20% more than the default interval before unwatching and closing.
    watcher.kill = async function() {
      return await new Promise(killResolve => {
        setTimeout(() => {
          watcher.unwatch(pattern);
          watcher.close();
          killResolve();
        }, watcher.options.interval * 1.2);
      });
    };

    watcher
      .on('add', wrapCallback(callback, 'created'))
      .on('change', wrapCallback(callback, 'modified'))
      .on('unlink', wrapCallback(callback, 'removed'))
      .on('ready', () => {
        resolve(watcher);
      });
  });
};

export default module;

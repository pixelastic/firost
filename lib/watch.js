import chokidar from 'chokidar';
import { _ } from 'golgoth';

/**
 * Watch for file changes, and execute specified callback on changed files
 * @param {String} pattern Glob pattern to match
 * @param {Function} callback Method to call on each changed file
 * @returns {Void}
 **/
const module = function watch(pattern, callback) {
  const watcher = chokidar.watch(pattern);
  watcher.on('change', _.debounce(callback, 500, { leading: true }));
};

export default module;

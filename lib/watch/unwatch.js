import helper from './helper.js';

/**
 * Kill a watcher by name.
 * @param {string|object} watcherName Watcher name
 * @returns {boolean} True on success, false otherwise
 **/
export default async function unwatch(watcherName) {
  const watcherData = helper.getWatcherData(watcherName);

  // Stop if no such watcher saved
  if (!watcherData) {
    return false;
  }

  // Unwatching chokidar
  await watcherData.chokidarWatcher.close();

  // Removing from cache
  helper.deleteWatcherData(watcherName);

  return true;
}

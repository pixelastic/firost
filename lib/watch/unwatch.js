import { deleteWatcherData, getWatcherData } from './helper/index.js';

/**
 * Kill a watcher by name.
 * @param {string|object} watcherName Watcher name
 * @returns {boolean} True on success, false otherwise
 **/
export async function unwatch(watcherName) {
  const watcherData = getWatcherData(watcherName);

  // Stop if no such watcher saved
  if (!watcherData) {
    return false;
  }

  // Unwatching chokidar
  await watcherData.chokidarWatcher.close();

  // Removing from cache
  deleteWatcherData(watcherName);

  return true;
}

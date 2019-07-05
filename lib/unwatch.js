import cache from './cache';

/**
 * Kill a watcher by name.
 * @param {string} watcherName Name of the watcher. Should be equal to the third
 * argument of watch()
 * @returns {boolean} True on success, false otherwise
 **/
const module = async function unwatch(watcherName = '') {
  // Stop if no watcher named passed
  if (!watcherName) {
    return false;
  }
  // Stop if no such watcher saved
  const watcherKey = `watchers.named.${watcherName}`;
  const watcher = cache.read(watcherKey);
  if (!watcher) {
    return false;
  }

  // Kill the watcher
  if (watcher.__kill) {
    await watcher.__kill();
    cache.clear(watcherKey);
  }
  return true;
};

export default module;

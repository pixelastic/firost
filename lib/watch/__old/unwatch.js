import { _ } from 'golgoth';
import cache from './cache.js';

/**
 * Kill a watcher by name.
 * @param {string|object} watcherInput Watcher or name of the watcher
 * @returns {boolean} True on success, false otherwise
 **/
export default async function unwatch(watcherInput) {
  let cacheKey;
  // Finding the correct watcher from its name
  if (_.isString(watcherInput)) {
    // Stop if no such watcher saved
    cacheKey = `watchers.${watcherInput}`;
    if (!cache.has(cacheKey)) {
      return false;
    }
  } else {
    cacheKey = `watchers.${watcherInput.firostName}`;
  }

  const watcherData = cache.read(cacheKey);
  const watcher = watcherData.watcher;

  // Unwatching
  await watcher.close();

  // Removing from cache
  cache.clear(cacheKey);

  return true;
}

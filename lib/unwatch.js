import cache from './cache';
import { _ } from 'golgoth';

/**
 * Kill a watcher by name.
 * @param {string|object} watcherInput Watcher or name of the watcher
 * @returns {boolean} True on success, false otherwise
 **/
const module = async function unwatch(watcherInput) {
  let watcher;
  // Finding the correct watcher from its name
  if (_.isString(watcherInput)) {
    // Stop if no such watcher saved
    const cacheKey = `watchers.${watcherInput}`;
    if (!cache.has(cacheKey)) {
      return false;
    }
    watcher = cache.read(cacheKey);
  } else {
    watcher = watcherInput;
  }

  // Unwatching
  const watcherData = _.get(watcher, 'firostData', {});
  watcher.unwatch(watcherData.pattern);
  watcher.close();

  // Removing from cache
  cache.clear(`watchers.${watcherData.name}`);

  return true;
};

export default module;

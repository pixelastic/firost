import { cache } from '../../cache.js';

/**
 * Pick a name for the new watcher. Names should be unique
 * @returns {string} Unique name, to be used by the watcher
 **/
export function pickWatcherName() {
  // Read current counter of watcher and increment it by one
  const watcherCounter = cache.read('__firostWatcherCounter', 0) + 1;
  cache.write('__firostWatcherCounter', watcherCounter);

  const watcherName = `watcher_${watcherCounter}`;
  return watcherName;
}

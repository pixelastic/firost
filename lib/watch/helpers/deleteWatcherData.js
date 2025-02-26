import { cache } from '../../cache.js';

/**
 * Delete data of a given watcher from the list of active watchers
 * @param {string} watcherName Name of the watcher to remove
 **/
export function deleteWatcherData(watcherName) {
  cache.clear(`__firostWatcherList.${watcherName}`);
}

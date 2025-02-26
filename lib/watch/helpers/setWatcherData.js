import { cache } from '../../cache.js';

/**
 * Updates watcher data for a given watcher
 * @param {string} watcherName Name of the watcher
 * @param {object} watcherData Data of the watcher
 **/
export function setWatcherData(watcherName, watcherData) {
  cache.write(`__firostWatcherList.${watcherName}`, watcherData);
}

import { cache } from '../../cache.js';

/**
 * Mark a given watcher as currently running its callback
 * @param {string} watcherName Name of the watcher to flag
 **/
export function flagCallbackAsRunning(watcherName) {
  cache.write(`__firostWatcherList.${watcherName}.callbackIsRunning`, true);
}

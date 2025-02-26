import { cache } from '../../cache.js';

/**
 * Mark a given watcher as no longer running its callbac
 * @param {string} watcherName Name of the watcher to unflag
 **/
export function unflagCallbackAsRunning(watcherName) {
  cache.write(`__firostWatcherList.${watcherName}.callbackIsRunning`, false);
}

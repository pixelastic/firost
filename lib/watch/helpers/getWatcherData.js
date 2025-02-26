import { _ } from 'golgoth';
import { getWatcherList } from './getWatcherList.js';

/**
 * Return watcher data for a given watcher name
 * @param {string} watcherName Name of the watcher to fetch
 * @returns {object} Contains .chokidarWatcher instance and .isCallbackRunning
 */
export function getWatcherData(watcherName) {
  return _.get(getWatcherList(), watcherName);
}

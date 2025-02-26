import { _ } from 'golgoth';
import { getWatcherList } from './getWatcherList.js';

/**
 * Returns the default polling interval watchers, in ms
 * @returns {number} Polling interval of watcher, in ms
 **/
export function getWatcherInterval() {
  return _.chain(getWatcherList())
    .sample()
    .get('chokidarWatcher.options.interval')
    .value();
}

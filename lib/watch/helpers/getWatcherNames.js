import { _ } from 'golgoth';
import { getWatcherList } from './getWatcherList.js';

/**
 * Returns an array of all active watcher names
 * @returns {Array} Array of watcher names
 **/
export function getWatcherNames() {
  return _.keys(getWatcherList() || {});
}

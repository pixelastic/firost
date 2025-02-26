import { _ } from 'golgoth';
import { cache } from '../../cache.js';

/**
 * Returns the list of all active watchers.
 * One watcher is created each time we call watch()
 * @returns {object} Each key being a watcher name and each value its data
 **/
export function getWatcherList() {
  const watcherList = cache.read('__firostWatcherList', {});
  return _.isEmpty(watcherList) ? false : watcherList;
}

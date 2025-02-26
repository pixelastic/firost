import { _ } from 'golgoth';
import { getWatcherList } from './getWatcherList.js';

/**
 * Check if there is currently any watcher running callback
 * @returns {boolean} True if at least one callback is running, false
 * otherwise
 **/
export function hasRunningCallbacks() {
  return !!_.chain(getWatcherList())
    .values()
    .find({ callbackIsRunning: true })
    .value();
}

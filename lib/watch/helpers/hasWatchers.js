import { getWatcherList } from './getWatcherList.js';

/**
 * Check if there is any currently active watcher
 * @returns {boolean} True if at least one active watcher, false otherwise
 **/
export function hasWatchers() {
  return !!getWatcherList();
}

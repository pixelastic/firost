import path from 'path';
import { _ } from 'golgoth';
import isGlob from 'is-glob';
import cache from '../cache.js';

export default {
  /**
   * Returns the list of all active watchers.
   * One watcher is created each time we call watch()
   * @returns {object} Each key being a watcher name and each value its data
   **/
  getWatcherList() {
    const watcherList = cache.read('__firostWatcherList', {});
    return _.isEmpty(watcherList) ? false : watcherList;
  },
  /**
   * Returns an array of all active watcher names
   * @returns {Array} Array of watcher names
   **/
  getWatcherNames() {
    return _.keys(this.getWatcherList() || {});
  },
  /**
   * Check if there is any currently active watcher
   * @returns {boolean} True if at least one active watcher, false otherwise
   **/
  hasWatchers() {
    return !!this.getWatcherList();
  },
  /**
   * Return watcher data for a given watcher name
   * @param {string} watcherName Name of the watcher to fetch
   * @returns {object} Contains .chokidarWatcher instance and .isCallbackRunning
   */
  getWatcherData(watcherName) {
    return _.get(this.getWatcherList(), watcherName);
  },
  /**
   * Updates watcher data for a given watcher
   * @param {string} watcherName Name of the watcher
   * @param {object} watcherData Data of the watcher
   **/
  setWatcherData(watcherName, watcherData) {
    cache.write(`__firostWatcherList.${watcherName}`, watcherData);
  },
  /**
   * Delete data of a given watcher from the list of active watchers
   * @param {string} watcherName Name of the watcher to remove
   **/
  deleteWatcherData(watcherName) {
    cache.clear(`__firostWatcherList.${watcherName}`);
  },
  /**
   * Mark a given watcher as currently running its callback
   * @param {string} watcherName Name of the watcher to flag
   **/
  flagCallbackAsRunning(watcherName) {
    cache.write(`__firostWatcherList.${watcherName}.callbackIsRunning`, true);
  },
  /**
   * Mark a given watcher as no longer running its callbac
   * @param {string} watcherName Name of the watcher to unflag
   **/
  unflagCallbackAsRunning(watcherName) {
    cache.write(`__firostWatcherList.${watcherName}.callbackIsRunning`, false);
  },
  /**
   * Returns the default polling interval watchers, in ms
   * @returns {number} Polling interval of watcher, in ms
   **/
  getWatcherInterval() {
    return _.chain(this.getWatcherList())
      .sample()
      .get('chokidarWatcher.options.interval')
      .value();
  },
  /**
   * Check if there is currently any watcher running callback
   * @returns {boolean} True if at least one callback is running, false
   * otherwise
   **/
  hasRunningCallbacks() {
    return !!_.chain(this.getWatcherList())
      .values()
      .find({ callbackIsRunning: true })
      .value();
  },
  /**
   * Pick a name for the new watcher. Names should be unique
   * @returns {string} Unique name, to be used by the watcher
   **/
  pickWatcherName() {
    // Read current counter of watcher and increment it by one
    const watcherCounter = cache.read('__firostWatcherCounter', 0) + 1;
    cache.write('__firostWatcherCounter', watcherCounter);

    const watcherName = `watcher_${watcherCounter}`;
    return watcherName;
  },
  /**
   * Find the only common path ancestor from a list of filepaths
   * @param {Array} filepaths List of filepaths and/or glob patterns
   * @returns {string} Single unique common ancestor directory of all inputs
   **/
  getCommonParent(filepaths) {
    const sortedList = _.chain(filepaths).castArray().sort().value();

    // Special case:
    // Only one element given, and it's a static filepath, so the ancestor is
    // its parent directory
    if (sortedList.length == 1 && !isGlob(sortedList[0])) {
      return path.dirname(sortedList[0]);
    }

    // Common ancestor is the common prefix between the first and last in
    // alphabetical order
    const first = _.chain(sortedList).first().split('/').compact().value();
    const last = _.chain(sortedList).last().split('/').compact().value();

    const result = _.chain(first)
      .reduce((accumulator, value, index) => {
        // If it's common between the first and last, and is not a glob pattern,
        // we keep the path part to build the final result
        const isSameAsLast = last[index] == value;
        const isGlobPattern = isGlob(value);
        if (isSameAsLast && !isGlobPattern) {
          accumulator.push(value);
        }
        return accumulator;
      }, [])
      .join('/')
      .value();

    return '/' + result;
  },
};

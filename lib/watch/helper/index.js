import { _ } from 'golgoth';
import cache from '../../cache.js';
import getCommonParentDirectory from './getCommonParentDirectory.js';

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
  getCommonParentDirectory,
};

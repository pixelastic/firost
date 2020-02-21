const cache = require('./cache');
const sleep = require('./sleep');
const _ = require('golgoth/lib/_');

/**
 * Wait until the next watch tick, making sure file events have a chance to
 * register
 * Note that this is a method that will be mostly useful in tests, making sure
 * our events correctly fire before asserting the results
 * @returns {any} Returns once it waited long enough
 **/
async function waitForWatchers() {
  const watcherNames = _.keys(cache.read('watchers', []));
  if (_.isEmpty(watcherNames)) {
    return;
  }

  // Take any watcher and  wait at least for the default interval
  const firstWatcherName = _.first(watcherNames);
  const firstWatcher = cache.read(`watchers.${firstWatcherName}`);
  const defaultInterval = _.get(firstWatcher, 'watcher.options.interval');
  await sleep(defaultInterval * 1.2);

  // Now, double check that no method is currently running
  const runningWatchers = _.filter(_.values(cache.read('watchers')), {
    isRunning: true,
  });
  if (!_.isEmpty(runningWatchers)) {
    await waitForWatchers();
  }
}
module.exports = waitForWatchers;

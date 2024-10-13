import { watch as chokidarWatch } from 'chokidar';
import multimatch from 'multimatch';
import { _ } from 'golgoth';
import helper from './helper/index.js';

/**
 * Watch for file changes, and execute specified callback on changed files
 * @param {string|Array} globPatterns Glob pattern to match
 * @param {Function} userCallback Method to call on each changed file
 * @returns {Promise} The ready watcher
 **/
export default async function watch(globPatterns, userCallback) {
  const directoryToWatch = await helper.getCommonParentDirectory(globPatterns);

  return await new Promise((resolve) => {
    const chokidarWatcher = chokidarWatch(directoryToWatch, {
      ignoreInitial: true,
    });

    // Each watcher has its own name
    const watcherName = helper.pickWatcherName();

    // Wrapper to create custom callback functions around user-defined callbacks
    const callUserCallback = function (eventType) {
      return async function (targetFile) {
        if (_.isEmpty(multimatch(targetFile, globPatterns))) {
          return;
        }

        // Mark the callback as running, so we can wait for it to finish when
        // calling unwatch()
        helper.flagCallbackAsRunning(watcherName);
        await userCallback(targetFile, eventType);
        helper.unflagCallbackAsRunning(watcherName);
      };
    };

    chokidarWatcher
      .on('ready', () => {
        // Save the watcher in cache, so we can kill it with unwatch() later
        helper.setWatcherData(watcherName, {
          chokidarWatcher,
          callbackIsRunning: false,
        });

        // We wait at least one cycle before returning
        setTimeout(() => {
          resolve(watcherName);
        }, chokidarWatcher.options.interval * 1.2);
      })
      .on('add', callUserCallback('created'))
      .on('change', callUserCallback('modified'))
      .on('unlink', callUserCallback('deleted'));
  });
}

import path from 'node:path';
import { _ } from 'golgoth';
import { watch as chokidarWatch } from 'chokidar';
import multimatch from 'multimatch';
import { caller } from '../caller.js';
import {
  flagCallbackAsRunning,
  getCommonParentDirectory,
  normalizeGlobPatterns,
  pickWatcherName,
  setWatcherData,
  unflagCallbackAsRunning,
} from './helpers/main.js';

/**
 * Watch for file changes, and execute specified callback on changed files
 * @param {string|Array} globPatterns Glob pattern to match
 * @param {Function} userCallback Method to call on each changed file
 * @returns {Promise} The ready watcher
 **/
export async function watch(globPatterns, userCallback) {
  const baseDir = path.dirname(caller());
  const normalizedPatterns = normalizeGlobPatterns(globPatterns, baseDir);
  const directoryToWatch = await getCommonParentDirectory(normalizedPatterns);

  return await new Promise((resolve) => {
    const chokidarWatcher = chokidarWatch(directoryToWatch, {
      ignoreInitial: true,
    });

    // Each watcher has its own name
    const watcherName = pickWatcherName();

    // Wrapper to create custom callback functions around user-defined callbacks
    const callUserCallback = function (eventType) {
      return async function (targetFile) {
        if (_.isEmpty(multimatch(targetFile, normalizedPatterns))) {
          return;
        }

        // Mark the callback as running, so we can wait for it to finish when
        // calling unwatch()
        flagCallbackAsRunning(watcherName);
        await userCallback(targetFile, eventType);
        unflagCallbackAsRunning(watcherName);
      };
    };

    chokidarWatcher
      .on('ready', () => {
        // Save the watcher in cache, so we can kill it with unwatch() later
        setWatcherData(watcherName, {
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

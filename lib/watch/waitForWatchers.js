import { sleep } from '../sleep.js';
import {
  getWatcherInterval,
  hasRunningCallbacks,
  hasWatchers,
} from './helper/index.js';

/**
 * Stalls the execution of the running script until watchers created by watch():
 * - Have the time to check for watched filepath at least once
 * - Finish any currently running callback
 *
 * Note: This makes sure that the watchers have the time to run, but is not
 * mandatory. If you have other long running processing tasks, runner might have
 * already run without the need for waitForWatchers.
 * It is better to use waitForWatchers for the guarantee that the watchers can
 * run, but not calling waitForWatchers does not enforce that that watchers are
 * not called.
 *
 * Note: This will most probably be used in tests of methods that use watch()
 * @returns {any} Returns once it has waited long enough
 **/
export async function waitForWatchers() {
  // Stop early if no watchers
  if (!hasWatchers()) {
    return;
  }

  // Wait a tiny bit more than this interval, to let it some breathing room
  await sleep(getWatcherInterval() * 1.2);

  // Wait again if any callback is still running
  if (hasRunningCallbacks()) {
    await waitForWatchers();
  }
  return;
}

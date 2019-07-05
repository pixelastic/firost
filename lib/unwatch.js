import cache from './cache';
import { _, pMap } from 'golgoth';

/**
 * Kill a watcher by name.
 * @param {string} watcherKey Name of the watcher. Should be equal to the third
 * argument of watch()
 * Note that deep dot notation is supported (that is, unwatch('foo') will
 * unwatch foo.bar and foo.baz if set)
 * @returns {boolean} True on success, false otherwise
 **/
const module = async function unwatch(watcherKey = '') {
  // Stop if no watcher named passed
  if (!watcherKey) {
    return false;
  }
  // Stop if no such watcher saved
  const cacheKey = `watchers.named.${watcherKey}`;
  if (!cache.has(cacheKey)) {
    return false;
  }

  // If this can be killed, we kill it right now
  const value = cache.read(cacheKey);
  if (_.has(value, '__kill')) {
    const watcher = value;
    await watcher.__kill();
    cache.clear(cacheKey);
    return true;
  }

  // Otherwise the key is an object that contains deeper keys, so we re-apply
  // the method recursively
  const list = _.keys(value);
  await pMap(list, async key => {
    return await module(`${watcherKey}.${key}`);
  });

  return true;
};

export default module;

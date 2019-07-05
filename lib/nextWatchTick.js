import cache from './cache';
import { _ } from 'golgoth';

/**
 * Wait until the next watch tick, making sure file events have a chance to
 * register
 * Note that this is a method that will be mostly useful in tests, making sure
 * our events correctly fire before asserting the results
 * @returns {any} Returns once it waited long enough
 **/
const module = async function nextWatchTick() {
  const watchers = _.values(cache.read('watchers', {}));
  if (_.isEmpty(watchers)) {
    return;
  }
  const anyWatcher = _.first(watchers);
  return await new Promise(resolve => {
    setTimeout(resolve, anyWatcher.options.interval * 1.2);
  });
};

export default module;

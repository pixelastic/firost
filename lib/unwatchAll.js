import cache from './cache';
import unwatch from './unwatch';
import { _, pMap } from 'golgoth';

/**
 * Unwatch all watchers, named and unnamed
 **/
const module = async function unwatchAll() {
  const watchers = _.values(cache.read('watchers', {}));
  await pMap(watchers, async watcher => {
    await unwatch(watcher);
  });
};

export default module;

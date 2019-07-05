import cache from './cache';
import unwatch from './unwatch';
import { _, pMap } from 'golgoth';

/**
 * Unwatch all watchers, named and unnamed
 **/
const module = async function unwatchAll() {
  // Unwatch all unnamed watchers
  const raw = cache.read('watchers.raw', []);
  await pMap(raw, async watcher => {
    await watcher.__kill();
  });
  cache.write([], 'watchers.raw');

  // Unwatch all named watchers
  const named = _.keys(cache.read('watchers.named', {}));
  await pMap(named, async key => {
    await unwatch(key);
  });
  cache.write({}, 'watchers.named');
};

export default module;

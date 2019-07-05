import cache from './cache';
import { _, pMap } from 'golgoth';

/**
 * Unwatch all watchers, named and unnamed
 **/
const module = async function unwatchAll() {
  const raw = cache.read('watchers.raw', []);
  const named = cache.read('watchers.named', {});

  const allWatchers = _.concat([], raw, _.values(named));

  await pMap(allWatchers, async watcher => {
    await watcher.__kill();
  });

  cache.write({}, 'watchers.named');
  cache.write([], 'watchers.raw');
};

export default module;

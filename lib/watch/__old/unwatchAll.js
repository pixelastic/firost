import { _, pMap } from 'golgoth';
import cache from './cache.js';
import unwatch from './unwatch.js';

/**
 * Unwatch all watchers, named and unnamed
 **/
export default async function unwatchAll() {
  const watchers = _.keys(cache.read('watchers', []));
  await pMap(watchers, async (watcherKey) => {
    await unwatch(watcherKey);
  });
}

import cache from './cache';
import unwatch from './unwatch';
import _ from 'golgoth/lib/_';
import pMap from 'golgoth/lib/pMap';

/**
 * Unwatch all watchers, named and unnamed
 **/
const module = async function unwatchAll() {
  const watchers = _.keys(cache.read('watchers', []));
  await pMap(watchers, async watcherKey => {
    await unwatch(watcherKey);
  });
};

export default module;

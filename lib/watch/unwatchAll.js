import { pMap } from 'golgoth';
import { unwatch } from './unwatch.js';
import { getWatcherNames } from './helpers/main.js';

/**
 * Unwatch all watchers, named and unnamed
 **/
export async function unwatchAll() {
  await pMap(getWatcherNames(), unwatch);
}

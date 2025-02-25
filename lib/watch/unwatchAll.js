import { pMap } from 'golgoth';
import { unwatch } from './unwatch.js';
import { getWatcherNames } from './helper/index.js';

/**
 * Unwatch all watchers, named and unnamed
 **/
export async function unwatchAll() {
  await pMap(getWatcherNames(), unwatch);
}

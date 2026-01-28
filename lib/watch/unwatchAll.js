import { pMap } from 'golgoth';
import { getWatcherNames } from './helpers/main.js';
import { unwatch } from './unwatch.js';

/**
 * Unwatch all watchers, named and unnamed
 **/
export async function unwatchAll() {
  await pMap(getWatcherNames(), unwatch);
}

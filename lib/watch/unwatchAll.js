import { pMap } from 'golgoth';
import unwatch from './unwatch.js';
import helper from './helper/index.js';

/**
 * Unwatch all watchers, named and unnamed
 **/
export default async function unwatchAll() {
  await pMap(helper.getWatcherNames(), unwatch);
}

const cache = require('./cache');
const unwatch = require('./unwatch');
const _ = require('golgoth/lib/_');
const pMap = require('golgoth/lib/pMap');

/**
 * Unwatch all watchers, named and unnamed
 **/
module.exports = async function unwatchAll() {
  const watchers = _.keys(cache.read('watchers', []));
  await pMap(watchers, async watcherKey => {
    await unwatch(watcherKey);
  });
};

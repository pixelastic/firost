const _ = require('golgoth/lodash');
const got = require('golgoth/got');
const error = require('./error');
const cache = require('./cache');
const urlToFilepath = require('./urlToFilepath');
const path = require('path');
const exists = require('./exists');
const read = require('./read');
const write = require('./write');

/**
 * Read a url and return its content
 * @param {string} inputUrl Url to read
 * @param {object} userOptions Options to change the caching behavior
 *  - memoryCache (Boolean, default true). First call will be cached in memory
 *  so subsequent calls to the same url in the same process will return the same
 *  value.
 *  - diskCache (default to false). If set to a filepath, results will be saved
 *  on disk, and read from this cache. Delete the folder when you need to clear
 *  the cache
 *  - headers (default to {}). HTTP headers to send with the request
 * @returns {Promise.<object>} The content of the url
 **/
async function readUrl(inputUrl, userOptions = {}) {
  const options = {
    memoryCache: true,
    diskCache: false,
    headers: {},
    ...userOptions,
  };

  const { memoryCache, diskCache, headers } = options;
  let diskCachePath;

  if (diskCache) {
    diskCachePath = path.resolve(diskCache, urlToFilepath(inputUrl));
  }

  // Return the version cached in memory
  const cacheKey = 'firost.readUrl';
  let urlCache;
  if (memoryCache) {
    urlCache = cache.read(cacheKey, {});
    const cachedValue = urlCache[inputUrl];
    if (cachedValue) {
      return cachedValue;
    }
  }

  // Return the version cached on disk
  if (diskCache && (await exists(diskCachePath))) {
    return await read(diskCachePath);
  }

  // Try to download the file
  let value;
  try {
    const response = await readUrl.__got(inputUrl, { headers });
    value = response.body;
  } catch (err) {
    const statusCode = _.get(err, 'response.statusCode');
    const statusMessage = _.get(err, 'response.statusMessage');
    const errorCode = `HTTP_ERROR_${statusCode}`;
    const errorMessage = `${inputUrl}: ${statusCode} ${statusMessage}`;
    throw error(errorCode, errorMessage);
  }

  // Write the value to memory cache
  if (memoryCache) {
    urlCache[inputUrl] = value;
    cache.write(cacheKey, urlCache);
  }
  // Write the value to disk cache
  if (diskCache) {
    await write(value, diskCachePath);
  }
  return value;
}

readUrl.__got = got;

module.exports = readUrl;

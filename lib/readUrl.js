import path from 'path';
import { _ } from 'golgoth';
import error from './error.js';
import cache from './cache.js';
import urlToFilepath from './urlToFilepath.js';
import exists from './exists.js';
import read from './read.js';
import write from './write.js';

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

  const { memoryCache, diskCache } = options;
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

  // Assign default headers, and normalizing to lower case
  const userHeaders = _.mapKeys(options.headers, (value, key) => {
    return key.toLowerCase();
  });
  const headers = {
    'accept-encoding': 'gzip, deflate',
    'user-agent': 'firost',
    accept: '*/*',
    ...userHeaders,
  };

  const response = await readUrl.__fetch(inputUrl, { headers });

  // Catch HTTP errors
  if (!response.ok) {
    const { status, statusText } = response;
    const errorCode = `HTTP_ERROR_${status}`;
    const errorMessage = `${inputUrl}: ${status} ${statusText}`;
    throw error(errorCode, errorMessage);
  }

  const value = await response.text();

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

// Two things here:
// 1. We use an internal reference to fetch, so we can mock it in tests
// 2. We use a full function scoping definition instead of doing
//    "readUrl.__fetch = fetch", otherwise fetch loses its reference to "this"
//    when bundled
readUrl.__fetch = async function __fetch(url, options) {
  return await fetch(url, options);
};

export default readUrl;

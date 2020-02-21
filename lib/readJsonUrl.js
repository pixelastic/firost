const _ = require('golgoth/lib/_');
const got = require('golgoth/lib/got');
const error = require('./error');
const cache = require('./cache');
const urlToFilepath = require('./urlToFilepath');
const path = require('path');
const exists = require('./exists');
const readJson = require('./readJson');
const writeJson = require('./writeJson');

/**
 * Read a json url and return its parsed content
 * @param {string} inputUrl Url to the JSON content
 * @param {object} userOptions Options to change the caching behavior
 *  - memoryCache (Boolean, default true). First call will be cached in memory
 *  so subsequent calls to the same url in the same process will return the same
 *  value.
 *  - diskCache (default to false). If set to a filepath, results will be saved
 *  on disk, and read from this cache. Delete the folder when you need to clear
 *  the cache
 * @returns {Promise.<object>} The parsed content of the Json file
 **/
module.exports = async function readJsonUrl(inputUrl, userOptions = {}) {
  const options = {
    memoryCache: true,
    diskCache: false,
    ...userOptions,
  };
  let diskCachePath;

  if (options.diskCache) {
    diskCachePath = path.resolve(options.diskCache, urlToFilepath(inputUrl));
  }

  // Return the version cached in memory
  const cacheKey = 'firost.readJsonUrl';
  let urlCache;
  if (options.memoryCache) {
    urlCache = cache.read(cacheKey, {});
    const cachedValue = urlCache[inputUrl];
    if (cachedValue) {
      return cachedValue;
    }
  }

  // Return the version cached on disk
  if (options.diskCache && (await exists(diskCachePath))) {
    return await readJson(diskCachePath);
  }

  // Try to download the file
  let response;
  try {
    response = await got(inputUrl);
  } catch (err) {
    const statusCode = _.get(err, 'response.statusCode');
    const statusMessage = _.get(err, 'response.statusMessage');
    const errorCode = `HTTP_ERROR_${statusCode}`;
    const errorMessage = `${inputUrl}: ${statusCode} ${statusMessage}`;
    throw error(errorCode, errorMessage);
  }

  // Try to parse the JSON
  try {
    const value = JSON.parse(response.body);
    // Write the value to memory cache
    if (options.memoryCache) {
      urlCache[inputUrl] = value;
      cache.write(cacheKey, urlCache);
    }
    // Write the value to disk cache
    if (options.diskCache) {
      await writeJson(value, diskCachePath);
    }
    return value;
  } catch (err) {
    throw error('ERROR_NOT_JSON', `${inputUrl} is not a valid JSON file`);
  }
};

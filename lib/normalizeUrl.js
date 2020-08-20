const normalizeUrl = require('normalize-url');
/**
 * Normalize a url:
 * - Sort searchParameters
 * - Remove final /index.html
 * @param {string} url Url to normalize
 * @param {object} options normalize-url, as defined in https://github.com/sindresorhus/normalize-url#options
 * @returns {string} Normalized url
 **/

module.exports = (url, options = {}) => {
  const normalizationOptions = {
    removeDirectoryIndex: true,
    ...options,
  };
  const normalizedUrl = normalizeUrl(url, normalizationOptions);

  // Add a final slash if url seems to target a directory and don't have a slash
  // already
  const parsedUrl = new URL(normalizedUrl);
  const isDirectory = !/^(.*)\.(.*){1,4}$/.test(parsedUrl.pathname);
  const hasTrailingSlash = parsedUrl.pathname.endsWith('/');

  if (isDirectory && !hasTrailingSlash) {
    parsedUrl.pathname = `${parsedUrl.pathname}/`;
  }

  return parsedUrl.toString();
};

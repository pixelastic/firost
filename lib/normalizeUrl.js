import normalizeUrlModule from 'normalize-url';

/**
 * Normalize a url:
 * - Sort searchParameters
 * - Remove final /index.html
 * @param {string} url Url to normalize
 * @param {object} options normalize-url, as defined in https://github.com/sindresorhus/normalize-url#options
 * @returns {string} Normalized url
 **/
export function normalizeUrl(url, options = {}) {
  const normalizationOptions = {
    removeDirectoryIndex: true,
    ...options,
  };
  return normalizeUrlModule(url, normalizationOptions);
}

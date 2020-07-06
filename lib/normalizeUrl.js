/**
 * Normalize a url:
 * - Sort searchParameters
 * - Remove final /index.html
 * @returns {string} Normalized url
 **/
const normalizeUrl = require('normalize-url');
module.exports = (url) => {
  return normalizeUrl(url, {
    removeDirectoryIndex: true,
  });
};

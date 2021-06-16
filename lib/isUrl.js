/**
 * Check if the given target is a url
 * @param {string} target URL or local path
 * @returns {boolean} True if a URL
 **/
module.exports = function isUrl(target) {
  const regexp = /^https?:\/\//;
  return regexp.test(target);
};

const _ = require('golgoth/_');
const { URL } = require('url');
const path = require('path');
const normalizeUrl = require('./normalizeUrl');

/**
 * Convert a url to a valid filepath
 * @param {string} userUrl Input url
 * @param {object} options
 * - options.extension: If set, will force the file extension
 * @returns {string} Filepath
 * This will split the url in subdirectories and encode the querystring as
 * part of the file name, while keeping the extension
 **/
module.exports = function urlToFilepath(userUrl, options = {}) {
  // Normalize the url
  const baseFakeUrl = 'http://__delete__/';
  const url = _.trimStart(userUrl, '/');
  const normalizedUrl = normalizeUrl(url, {
    defaultProtocol: baseFakeUrl,
    removeDirectoryIndex: false,
    stripWWW: false,
  });
  const parsed = new URL(normalizedUrl, baseFakeUrl);

  const pathname = parsed.pathname;
  const protocol = parsed.protocol.replace(':', '');
  const host = parsed.host;
  const urlPath = _.compact(pathname.split('/'));
  const filepath = _.concat([protocol, host], urlPath.slice(0, -1));

  let extname = path.extname(pathname);
  const basename = path.basename(pathname, extname);
  if (options.extension) {
    extname = `.${options.extension}`;
  }

  if (parsed.search) {
    const searchParams = parsed.searchParams;
    searchParams.sort();
    let queryAsArray = [];
    searchParams.forEach((value, key) => {
      queryAsArray.push(value ? `${key}-${value}` : key);
    });
    const query = queryAsArray.join('_');
    filepath.push(`${basename}_${query}${extname}`);
  } else {
    filepath.push(`${basename}${extname}`);
  }

  return _.chain(filepath)
    .join('/')
    .replace(/^http\/__delete__\//, '')
    .value();
};

const _ = require('golgoth/lib/_');
const queryString = require('golgoth/lib/queryString');
const { URL } = require('url');
const path = require('path');

/**
 * Convert a url to a valid filepath
 * @param {string} input Input url
 * @param {object} options
 * - options.extension: If set, will force the file extension
 * @returns {string} Filepath
 * This will split the url in subdirectories and encode the querystring as
 * part of the file name, while keeping the extension
 **/
module.exports = function urlToFilepath(input, options = {}) {
  const parsed = new URL(input);

  const protocol = _.chain(parsed).get('protocol').replace(':', '').value();
  const host = _.get(parsed, 'host');
  const urlPath = _.chain(parsed)
    .get('pathname')
    .split('/')
    .dropRight(1)
    .compact()
    .value();
  const filepath = _.concat([protocol, host], urlPath);

  const pathname = _.get(parsed, 'pathname');
  const originalExtname = path.extname(pathname);
  const customExtname = _.has(options, 'extension')
    ? `.${options.extension}`
    : null;
  const extname = customExtname || originalExtname;
  const basename = path.basename(pathname, originalExtname);

  if (_.get(parsed, 'search')) {
    const query = _.chain(parsed)
      .get('search')
      .thru(queryString.parse)
      .map((value, key) => ({ key, value }))
      .sortBy(['key'])
      .map((item) => `${item.key}-${item.value}`)
      .join('_')
      .value();
    filepath.push(`${basename}_${query}${extname}`);
  } else {
    filepath.push(`${basename}${extname}`);
  }

  return _.join(filepath, '/');
};

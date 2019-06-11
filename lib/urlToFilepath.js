import { _, queryString as qs } from 'golgoth';
import url from 'url';
import path from 'path';

/**
 * Convert a url to a valid filepath
 * @param {String} input Input url
 * @param {Object} options
 *  - options.extension: If set, will force the file extension
 * @returns {String} Filepath
 * This will split the url in subdirectories and encode the querystring as
 * part of the file name, while keeping the extension
 **/
const module = function urlToFilepath(input, options = {}) {
  const parsed = url.parse(input);

  const protocol = _.chain(parsed)
    .get('protocol')
    .replace(':', '')
    .value();
  const host = _.get(parsed, 'host');
  const urlPath = _.chain(parsed)
    .get('path')
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
  const basename = path.basename(_.get(parsed, 'pathname'), originalExtname);

  if (_.get(parsed, 'query')) {
    const query = _.chain(parsed)
      .get('query')
      .thru(qs.parse)
      .map((value, key) => ({ key, value }))
      .sortBy(['key'])
      .map(item => `${item.key}-${item.value}`)
      .join('_')
      .value();
    filepath.push(`${basename}_${query}${extname}`);
  } else {
    filepath.push(`${basename}${extname}`);
  }

  return _.join(filepath, '/');
};

export default module;

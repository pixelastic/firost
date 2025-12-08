import { URL } from 'node:url';
import path from 'node:path';
import { _ } from 'golgoth';
import revHash from 'rev-hash';
import { normalizeUrl } from './normalizeUrl.js';

/**
 * Convert a url to a valid filepath
 * @param {string} userUrl Input url
 * @param {object} options
 * - options.extension: If set, will force the file extension
 * @returns {string} Filepath
 * This will split the url in subdirectories and encode the querystring as
 * part of the file name, while keeping the extension
 **/
export function urlToFilepath(userUrl, options = {}) {
  // Normalize the url
  const url = _.trimStart(userUrl, '/');
  const normalizedUrl = normalizeUrl(url, {
    defaultProtocol: 'firost',
    removeDirectoryIndex: false,
    stripWWW: false,
  });
  const parsed = new URL(normalizedUrl);

  const pathname = parsed.pathname;
  const protocol = parsed.protocol.replace(':', '');
  const host = parsed.host;
  const urlPath = _.compact(pathname.split('/'));
  const filepath = _.concat([protocol, host], urlPath.slice(0, -1));

  let extname = path.extname(pathname);
  let basename = path.basename(pathname, extname);
  if (options.extension) {
    extname = `.${options.extension}`;
  }

  if (parsed.search) {
    const searchParams = parsed.searchParams;
    searchParams.sort();
    let queryAsArray = [];
    searchParams.forEach((value, key) => {
      // Replace forbidden chars (space and :) with underscore
      value = value.replace(/ |:/g, '_');
      queryAsArray.push(value ? `${key}-${value}` : key);
    });
    const query = queryAsArray.join('_');
    basename = `${basename}_${query}${extname}`;
  } else {
    basename = `${basename}${extname}`;
  }

  // If basenames are too long, they will throw a `ENAMETOOLONG`. In that case,
  // we will hash part of them
  const ENAMETOOLONG_LIMIT = 255;
  if (basename.length > ENAMETOOLONG_LIMIT) {
    const hash = revHash(basename);
    const prefix = basename.slice(0, 50);
    const suffix = basename.slice(-50);
    basename = `${prefix}_${hash}_${suffix}`;
  }

  filepath.push(basename);

  return _.chain(filepath)
    .join('/')
    .replace(/^firost\/\//, '')
    .value();
}

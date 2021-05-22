const fs = require('fs-extra');
const path = require('path');
const mkdirp = require('./mkdirp');
const absolute = require('./absolute');
const _ = require('golgoth/lodash');

/**
 * Write some content to disk
 * Note: It will create the directories if needed
 * @param {string} what Content to write to the file
 * @param {string} userWhere Destination filepath
 **/
module.exports = async function write(what, userWhere) {
  // Do nothing if there is no content to write
  if (!_.isString(what)) {
    return;
  }
  const where = absolute(userWhere);
  await mkdirp(path.dirname(where));
  await fs.writeFile(where, what);
};

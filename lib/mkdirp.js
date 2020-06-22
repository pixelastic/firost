const fs = require('fs-extra');
const absolute = require('./absolute');

/**
 * Create directories recursively
 * @param {string} userWhere Directory path to create
 **/
module.exports = async function mkdirp(userWhere) {
  const where = absolute(userWhere);
  await fs.mkdirp(where);
};

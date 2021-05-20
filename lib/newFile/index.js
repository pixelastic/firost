const path = require('path');
const mkdirp = require('../mkdirp');
const write = require('../write');
const exists = require('../exists');
const copy = require('../copy');
const _ = require('golgoth/lodash');

/**
 * Create the smallest possible syntactically valid file at the specified
 * location
 * @param {string} filepath Path to create the file
 */
module.exports = async function newFile(filepath) {
  const extension = _.trim(path.extname(filepath), '.');

  // Only create a folder if no extension is given
  if (!extension) {
    await mkdirp(filepath);
    return;
  }

  // Check if we have a template for this extension
  const templatePath = path.resolve(
    __dirname,
    'templates',
    `${extension}.${extension}`
  );
  if (!(await exists(templatePath))) {
    await write('', filepath);
    return;
  }

  await copy(templatePath, filepath);
};

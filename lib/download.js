const fs = require('fs-extra');
const _ = require('golgoth/lib/_');
const pify = require('golgoth/lib/pify');
const got = require('golgoth/lib/got');
const mkdirp = require('./mkdirp');
const path = require('path');
const stream = require('stream');
const isDirectory = require('./isDirectory');
const error = require('./error');

/**
 * Download the file at the specified url to disk
 * @param {string} targetUrl Url of the file to download
 * @param {string} userDestination Path on disk to save it to
 * @returns {string} File content
 **/
module.exports = async function download(targetUrl, userDestination) {
  let destination = userDestination;

  // Saving inside a directory if destination is a directory
  const isDestinationDirectory = await isDirectory(destination);
  if (isDestinationDirectory) {
    const basename = path.basename(targetUrl);
    destination = `${destination}/${basename}`;
  }

  // We create the nested path up to the destination
  await mkdirp(path.dirname(destination));

  // Check if the resource exists first and reject if not
  try {
    await got.head(targetUrl);
  } catch (err) {
    const statusCode = _.get(err, 'response.statusCode');
    const statusMessage = _.get(err, 'response.statusMessage');
    const errorCode = `HTTP_ERROR_${statusCode}`;
    const errorMessage = `${targetUrl}: ${statusCode} ${statusMessage}`;
    throw error(errorCode, errorMessage);
  }

  // Reading from url, listening to content, and writing to file
  const pipeline = pify(stream.pipeline);
  const listener = new stream.PassThrough();
  const chunks = [];
  listener.on('data', chunk => {
    chunks.push(chunk);
  });

  await pipeline(
    got.stream(targetUrl),
    listener,
    fs.createWriteStream(destination)
  );
  return Buffer.concat(chunks).toString();
};

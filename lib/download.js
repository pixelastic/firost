import fs from 'fs-extra';
import got from 'got';
import mkdirp from './mkdirp';
import path from 'path';
import isDirectory from './isDirectory';
import error from './error';

/**
 * Download the file at the specified url to disk
 * @param {String} targetUrl Url of the file to download
 * @param {String} userDestination Path on disk to save it to
 * @returns {Void}
 **/
const module = async function download(targetUrl, userDestination) {
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
    const errorCode = `HTTP_ERROR_${err.statusCode}`;
    const errorMessage = `${targetUrl}: ${err.statusCode} ${err.statusMessage}`;
    throw error(errorCode, errorMessage);
  }

  return await new Promise((resolve, reject) => {
    const writeStream = fs.createWriteStream(destination);
    writeStream.on('finish', resolve);

    try {
      got.stream(targetUrl).pipe(writeStream);
    } catch (err) {
      reject(err);
    }
  });
};
export default module;

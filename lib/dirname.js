import * as url from 'url';
import path from 'path';
import callsites from 'callsites';
import { _ } from 'golgoth';

/**
 * Polyfill for the old __dirname, returning path to the current script
 * directory
 * @returns {string} Path to the current script directory
 **/
export default function () {
  const callingFile = callsites()[1].getFileName();

  // callingFile is a file:// protocol (absolute paths to imports)
  if (callingFile.startsWith('file://')) {
    return _.trimEnd(url.fileURLToPath(new URL('.', callingFile)), '/');
  }

  // callingFile is a regular import
  return path.dirname(callingFile);
}

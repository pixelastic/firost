import path from 'path';
import tempDir from 'temp-dir';
import uuid from './uuid.js';
/**
 * Return the path to a temporary folder
 * @param {string} scope Optional subdirectories in the tmp folder
 * @returns {string} Filepath to the temp directory
 **/
export default function (scope = '') {
  return scope
    ? path.resolve(tempDir, scope, uuid())
    : path.resolve(tempDir, uuid());
}

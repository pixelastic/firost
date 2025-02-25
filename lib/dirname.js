import path from 'node:path';
import { callstack } from './callstack.js';

/**
 * Polyfill for the old __dirname, returning path to the current script
 * directory
 *
 * Can also work as path.dirname if an argument is passed. This is done as
 * a precaution measure in case it is called by mistake with an argument. This
 * would avoid deleting files in the current directory rather than in the
 * specified one.
 *
 * @param {string} input (optional) Filepath to get the dirname from. Default to
 * current directory if empty
 * @returns {string} Path to the directory
 **/
export function dirname(input) {
  return path.dirname(input || callstack(1).filepath);
}

import path from 'path';
import callstack from './callstack.js';

/**
 * Polyfill for the old __dirname, returning path to the current script
 * directory
 * @returns {string} Path to the current script directory
 **/
export default function () {
  return path.dirname(callstack()[1].filepath);
}

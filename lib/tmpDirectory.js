import fs from 'node:fs';
import os from 'node:os';
import { _ } from 'golgoth';
import { absolute } from './absolute.js';
import { uuid } from './uuid.js';

export let __;

/**
 * Returns a temporary directory path
 * @param {string | object} argOne - Either a scope string or options object
 * @param {object} argTwo - Options object when argOne is a scope string
 * @returns {string} Absolute path to the temporary directory
 * Usage:
 * Returns a path like '/dev/shm/{uuid}' (or '/tmp/{uuid}' if /dev/shm is not available)
 * tmpDirectory()
 
 * Returns a path like '/dev/shm/subdir/{uuid}' (or '/tmp/subdir/{uuid}')
 * tmpDirectory('subdir')
 *
 * Forces using disk even if /dev/shm is available
 * tmpDirectory({ forceDisk: true })
 *
 * Combines scope and options
 * tmpDirectory('subdir', { forceDisk: true })
 */
export function tmpDirectory(argOne, argTwo) {
  __.ensureUseRamCheck();

  const { scope, userOptions } = __.parseArgs(argOne, argTwo);
  const options = {
    forceDisk: false,
    ...userOptions,
  };

  const useDisk = !__.useRam || options.forceDisk;

  const pathParts = [];
  pathParts.push(useDisk ? os.tmpdir() : '/dev/shm');
  pathParts.push('firost');
  if (scope) {
    pathParts.push(scope);
  }
  pathParts.push(__.uuid());
  return absolute(...pathParts);
}

__ = {
  useRam: undefined,
  /**
   * Ensures that the /dev/shm detection has been performed and caches the result.
   * If the detection has already been done, returns immediately without re-checking.
   * @returns {void}
   */
  ensureUseRamCheck() {
    if (__.useRam !== undefined) {
      return;
    }
    __.useRam = __.hasDevShm();
  },
  /**
   * Checks if the /dev/shm directory exists on the system
   * @returns {boolean} True if /dev/shm directory exists, false otherwise
   */
  hasDevShm() {
    return fs.existsSync('/dev/shm');
  },
  /**
   * Parses and normalizes arguments for temporary directory creation
   * @param {string | object} argOne - Either a scope string or options object
   * @param {object} argTwo - User options object when argOne is a scope string
   * @returns {object} Parsed arguments with scope and userOptions properties
   */
  parseArgs(argOne, argTwo) {
    // tmpDirectory()
    if (!argOne && !argTwo) {
      return { scope: null, userOptions: {} };
    }

    // tmpDirectory('subdir', { forceDisk: true })
    if (argOne && argTwo) {
      return { scope: argOne, userOptions: argTwo };
    }

    // tmpDirectory('subdir')
    if (_.isString(argOne)) {
      return { scope: argOne, userOptions: {} };
    }

    // tmpDirectory({ forceDisk: true })
    return { scope: null, userOptions: argOne };
  },
  uuid,
};

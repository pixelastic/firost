import path from 'node:path';
import { callstack } from './callstack.js';
import { uuid } from './uuid.js';

/**
 * Wrapper around the raw require() call
 * @param {string} userModuleName Module identifier (name or path);
 * @param {object} userOptions Options to change behavior:
 * - forceReload {boolean} If set to true, will force reloading the module and
 *   not used the cached singleton. Default: false
 * @returns {*} Module content
 **/
export async function firostImport(userModuleName, userOptions = {}) {
  const options = {
    forceReload: false,
    ...userOptions,
  };
  let moduleName = userModuleName;

  // Converting path relative to the caller to absolute paths
  if (moduleName.startsWith('.')) {
    const callingPath = path.dirname(callstack(1).filepath);
    moduleName = path.resolve(callingPath, moduleName);
  }

  // Bypass cache
  if (options.forceReload) {
    moduleName = `${moduleName}?cacheBusting=${uuid()}`;
  }

  // Load the module
  const result = await import(moduleName);

  // Simulate ESM by picking the .default key
  return result.default || result;
}

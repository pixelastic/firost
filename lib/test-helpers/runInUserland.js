import { dirname } from '../dirname.js';
import { packageRoot } from '../packageRoot/index.js';
import { write } from '../write.js';
import { firostImport } from '../firostImport.js';

/**
 * Run code from a userland context (outside of firost) for testing purposes.
 * @param {string} code JavaScript code to execute in userland
 * @param {string} filepath Absolute path where to save the userland file
 * @returns {Promise<any>} The result returned by the userland code
 **/
export async function runInUserland(code, filepath) {
  const libRoot = packageRoot(dirname());

  // We write a file that only exporrs a run() function, that we can call
  const userlandCode = `
    import { firostImport } from 'file://${libRoot}/firostImport.js';

    export async function run() {
      const { absolute } = await firostImport('file://${libRoot}/absolute.js', { forceReload: true });
      const { packageRoot } = await firostImport('file://${libRoot}/packageRoot/index.js', { forceReload: true });
      const { gitRoot } = await firostImport('file://${libRoot}/gitRoot/index.js', { forceReload: true });

      ${code}
    }
  `;

  await write(userlandCode, filepath);
  const { run } = await firostImport(filepath, { forceReload: true });
  return await run();
}

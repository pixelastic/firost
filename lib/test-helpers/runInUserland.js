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

  // We write a file that only exports a run() function, that we can call
  const userlandCode = `
    import { firostImport } from 'file://${libRoot}/firostImport.js';

    // Make available a function to import anything from firost
    async function __import(modulePath) {
      return await firostImport(\`file://${libRoot}/\${modulePath}\`, { forceReload: true });
    }

    export async function run() {
      ${code}
    }
  `;

  await write(userlandCode, filepath);
  const { run } = await firostImport(filepath, { forceReload: true });
  return await run();
}

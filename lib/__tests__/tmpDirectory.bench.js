import { copy } from '../copy.js';
import { move } from '../move.js';
import { newFile } from '../newFile/index.js';
import { read } from '../read.js';
import { remove } from '../remove.js';
import { tmpDirectory } from '../tmpDirectory.js';
import { write } from '../write.js';

/**
 * Performs a realistic file I/O workflow simulation including writing, reading, copying, moving, and removing files
 * @param {string} testDirectory - The base directory path where all file operations will be performed
 * @returns {Promise<void>} A promise that resolves when all file operations are complete
 */
async function realisticIOWorkflow(testDirectory) {
  await write('Something', `${testDirectory}/README.md`);
  await read(`${testDirectory}/README.md`);

  await newFile(`${testDirectory}/image.png`);
  await newFile(`${testDirectory}/archive.zip`);

  await write('Something else', `${testDirectory}/README.md`);

  await copy(`${testDirectory}/image.png`, `${testDirectory}/assets/logo.png`);
  await remove(`${testDirectory}/image.png`);

  await move(
    `${testDirectory}/archive.zip`,
    `${testDirectory}/download/release.zip`,
  );

  await remove(`${testDirectory}/image.png`);
}

describe('tmpDirectory performance', () => {
  bench('with RAM (default)', async () => {
    const testDirectory = tmpDirectory('firost/tmpDirectory');
    await realisticIOWorkflow(testDirectory);
    await remove(testDirectory);
  });
  bench('with disk (forceDisk: true)', async () => {
    const testDirectory = tmpDirectory('firost/tmpDirectory', {
      forceDisk: true,
    });
    await realisticIOWorkflow(testDirectory);
    await remove(testDirectory);
  });
});

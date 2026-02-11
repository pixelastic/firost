import { copy } from '../copy.js';
import { move } from '../move.js';
import { newFile } from '../newFile/index.js';
import { read } from '../read.js';
import { remove } from '../remove.js';
import { tmpDirectory } from '../tmpDirectory.js';
import { write } from '../write.js';

describe('tmpDirectory performance', () => {
  describe('with /tmp', () => {
    const testDirectory = tmpDirectory('firost/bench/tmpDirectory');
    beforeEach(async () => {
      await remove(testDirectory);
    });
    bench('realistic I/O workflow', async () => {
      await write('Something', `${testDirectory}/README.md`);
      await read(`${testDirectory}/README.md`);

      await newFile(`${testDirectory}/image.png`);
      await newFile(`${testDirectory}/archive.zip`);

      await write('Something else', `${testDirectory}/README.md`);

      await copy(
        `${testDirectory}/image.png`,
        `${testDirectory}/assets/logo.png`,
      );
      await remove(`${testDirectory}/image.png`);

      await move(
        `${testDirectory}/archive.zip`,
        `${testDirectory}/download/release.zip`,
      );

      await remove(`${testDirectory}/image.png`);
    });
  });
});

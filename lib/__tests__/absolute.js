import os from 'node:os';
import { _ } from 'golgoth';
import { mkdirp } from '../mkdirp.js';
import { tmpDirectory } from '../tmpDirectory.js';
import { newFile } from '../newFile/index.js';
import { emptyDir } from '../emptyDir.js';
import { runInUserland } from '../test-helpers/runInUserland.js';

const homePath = os.homedir();

describe('absolute', () => {
  const testDirectory = tmpDirectory('firost/absolute');
  it.each([
    // Absolute paths
    [['/tmp/one'], '/tmp/one'],
    [['/tmp/one/../two'], '/tmp/two'],
    [['/tmp/one/./two'], '/tmp/one/two'],
    [['/tmp', 'one', './two'], '/tmp/one/two'],
    // Home directory
    [['~/one'], `${homePath}/one`],
    [['~/one/two/../three'], `${homePath}/one/three`],
    [['~/one/./two'], `${homePath}/one/two`],
    [['~', 'one', 'two', '..', 'three'], `${homePath}/one/three`],
    // Relative paths
    [['./two.js'], `${testDirectory}/lib/src/two.js`],
    [['./one/two/../three'], `${testDirectory}/lib/src/one/three`],
    [['./one/./two'], `${testDirectory}/lib/src/one/two`],
    [['./one', './two'], `${testDirectory}/lib/src/one/two`],
    [['two.js'], `${testDirectory}/lib/src/two.js`],
    [['..'], `${testDirectory}/lib`],
    [['../.'], `${testDirectory}/lib`],
    [['.'], `${testDirectory}/lib/src`],
    // No argument, default to current file
    [[], `${testDirectory}/lib/src/app.js`],
    // <packageRoot> placeholder
    [['<packageRoot>/one'], `${testDirectory}/lib/one`],
    [['<packageRoot>/one/two/../three'], `${testDirectory}/lib/one/three`],
    [['<packageRoot>/one/./two'], `${testDirectory}/lib/one/two`],
    [['<packageRoot>/one', './two'], `${testDirectory}/lib/one/two`],
    [['/tmp/<packageRoot>/one'], '/tmp/<packageRoot>/one'],
    // <gitRoot> placeholder
    [['<gitRoot>/one'], `${testDirectory}/one`],
    [['<gitRoot>/one/two/../three'], `${testDirectory}/one/three`],
    [['<gitRoot>/one/./two'], `${testDirectory}/one/two`],
    [['<gitRoot>', './one/./two'], `${testDirectory}/one/two`],
    [['/tmp/<gitRoot>/one'], '/tmp/<gitRoot>/one'],
  ])('%s', async (input, expected) => {
    // Given
    await mkdirp(`${testDirectory}/.git`); // .git directory at the root
    await newFile(`${testDirectory}/lib/package.json`); // package.json in lib/

    // Convert the input array as a valid argument string
    const inputAsString = _.chain(input)
      .map((arg) => {
        return `'${arg}'`;
      })
      .join(', ')
      .value();

    // When
    const actual = await runInUserland(
      `return absolute(${inputAsString})`,
      `${testDirectory}/lib/src/app.js`,
    );
    expect(actual).toEqual(expected);
    await emptyDir(testDirectory);
  });
});

import os from 'node:os';
import { _ } from 'golgoth';
import { mkdirp } from '../mkdirp.js';
import { newFile } from '../newFile/index.js';
import { remove } from '../remove.js';
import { runInUserland } from '../test-helpers/runInUserland.js';
import { tmpDirectory } from '../tmpDirectory.js';

const homePath = os.homedir();

describe('absolute', () => {
  const testDirectory = tmpDirectory(`firost/${describeName}`);
  afterEach(async () => {
    await remove(testDirectory);
  });
  it.each([
    // Absolute paths
    [{ input: ['/tmp/one'], expected: '/tmp/one' }],
    [{ input: ['/tmp/one/../two'], expected: '/tmp/two' }],
    [{ input: ['/tmp/one/./two'], expected: '/tmp/one/two' }],
    [{ input: ['/tmp', 'one', './two'], expected: '/tmp/one/two' }],
    // Home directory
    [{ input: ['~/one'], expected: `${homePath}/one` }],
    [{ input: ['~/one/two/../three'], expected: `${homePath}/one/three` }],
    [{ input: ['~/one/./two'], expected: `${homePath}/one/two` }],
    [
      {
        input: ['~', 'one', 'two', '..', 'three'],
        expected: `${homePath}/one/three`,
      },
    ],
    // Relative paths
    [{ input: ['./two.js'], expected: `${testDirectory}/lib/src/two.js` }],
    [
      {
        input: ['./one/two/../three'],
        expected: `${testDirectory}/lib/src/one/three`,
      },
    ],
    [{ input: ['./one/./two'], expected: `${testDirectory}/lib/src/one/two` }],
    [
      {
        input: ['./one', './two'],
        expected: `${testDirectory}/lib/src/one/two`,
      },
    ],
    [{ input: ['two.js'], expected: `${testDirectory}/lib/src/two.js` }],
    [{ input: ['..'], expected: `${testDirectory}/lib` }],
    [{ input: ['../.'], expected: `${testDirectory}/lib` }],
    [{ input: ['.'], expected: `${testDirectory}/lib/src` }],
    // No argument, default to current file
    [{ input: [], expected: `${testDirectory}/lib/src/app.js` }],
    // Tests avec options.cwd - chemins absolus (doivent ignorer cwd)
    [
      {
        input: ['/tmp/file.txt', { cwd: '/ignored' }],
        expected: '/tmp/file.txt',
      },
    ],
    [
      {
        input: ['/tmp/one/../two', { cwd: '/ignored' }],
        expected: '/tmp/two',
      },
    ],
    // Tests avec options.cwd - tilde (doivent ignorer cwd)
    [
      {
        input: ['~/config', { cwd: '/ignored' }],
        expected: `${homePath}/config`,
      },
    ],
    [
      {
        input: ['~/.npmrc', { cwd: '/ignored' }],
        expected: `${homePath}/.npmrc`,
      },
    ],
    // Tests avec spread syntax + cwd
    [
      {
        input: ['./one', 'two', 'three.txt', { cwd: '/project' }],
        expected: '/project/one/two/three.txt',
      },
    ],
    [
      {
        input: ['.', 'dist', 'output.js', { cwd: '/app' }],
        expected: '/app/dist/output.js',
      },
    ],
    [
      {
        input: ['./config.json', { cwd: '/custom/path' }],
        expected: '/custom/path/config.json',
      },
    ],
    [
      {
        input: ['./one/two/three', { cwd: '/base' }],
        expected: '/base/one/two/three',
      },
    ],
    [
      {
        input: ['./one/../two', { cwd: '/base' }],
        expected: '/base/two',
      },
    ],
  ])('$input', async ({ input, expected }) => {
    // Given
    await mkdirp(`${testDirectory}/.git`); // .git directory at the root
    await newFile(`${testDirectory}/lib/package.json`); // package.json in lib/

    // Convert the input array as a valid argument string
    const inputAsString = _.chain(input)
      .map((arg) => {
        return _.isPlainObject(arg) ? JSON.stringify(arg) : `'${arg}'`;
      })
      .join(', ')
      .value();

    // When
    const actual = await runInUserland(
      dedent`
        const { absolute } = await __import('./absolute.js');
        return absolute(${inputAsString})
      `,
      `${testDirectory}/lib/src/app.js`,
    );
    expect(actual).toEqual(expected);
  });
});

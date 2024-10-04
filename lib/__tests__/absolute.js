import os from 'os';
import path from 'path';
import current from '../absolute.js';
import gitRoot from '../gitRoot/index.js';
import packageRoot from '../packageRoot/index.js';
import here from '../here.js';

describe('absolute', () => {
  const dirs = {
    here: path.dirname(here()),
    home: os.homedir(),
    gitRoot: gitRoot(),
    packageRoot: packageRoot(),
    cwd: process.cwd(),
  };
  it.each([
    // Empty
    [[], here()],
    // Tilde
    [['~/one'], `${dirs.home}/one`],
    [['~/one/two/../three'], `${dirs.home}/one/three`],
    [['~/one/./two'], `${dirs.home}/one/two`],
    [['~', 'one', 'two', '..', 'three'], `${dirs.home}/one/three`],
    // Absolute
    [['/tmp/one'], '/tmp/one'],
    [['/tmp/one/../two'], '/tmp/two'],
    [['/tmp/one/./two'], '/tmp/one/two'],
    [['/tmp', 'one', './two'], '/tmp/one/two'],
    // Relative with ./
    [['./two.js'], `${dirs.here}/two.js`],
    [['./one/two/../three'], `${dirs.here}/one/three`],
    [['./one/./two'], `${dirs.here}/one/two`],
    [['./one', './two'], `${dirs.here}/one/two`],
    // Relative without prefix
    [['two.js'], `${dirs.here}/two.js`],
    // <gitRoot> prefix
    [['<gitRoot>/one'], `${dirs.gitRoot}/one`],
    [['<gitRoot>/one/two/../three'], `${dirs.gitRoot}/one/three`],
    [['<gitRoot>/one/./two'], `${dirs.gitRoot}/one/two`],
    [['<gitRoot>', './one/./two'], `${dirs.gitRoot}/one/two`],
    // <packageRoot> prefix
    [['<packageRoot>/one'], `${dirs.packageRoot}/one`],
    [['<packageRoot>/one/two/../three'], `${dirs.packageRoot}/one/three`],
    [['<packageRoot>/one/./two'], `${dirs.packageRoot}/one/two`],
    [['<packageRoot>/one', './two'], `${dirs.packageRoot}/one/two`],
    // <cwd> prefix
    [['<cwd>/one'], `${dirs.cwd}/one`],
    [['<cwd>/one/two/../three'], `${dirs.cwd}/one/three`],
    [['<cwd>/one/./two'], `${dirs.cwd}/one/two`],
    [['<cwd>', 'one', '.', 'two'], `${dirs.cwd}/one/two`],
  ])('%s => %s', async (input, expected) => {
    const actual = current(...input);
    expect(actual).toEqual(expected);
  });
});

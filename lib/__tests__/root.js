const current = require('../root');
const path = require('path');
const readJson = require('../readJson');
const writeJson = require('../writeJson');
const tmpDirectory = require('../tmpDirectory');

describe('root', () => {
  it('should return the root folder', async () => {
    const actual = await current();
    const packageJson = await readJson(path.resolve(actual, 'package.json'));
    expect(packageJson).toHaveProperty('name', 'firost');
  });
  it('should allow changing the reference dir', async () => {
    const tmpRepoBase = tmpDirectory();
    const packagePath = path.resolve(tmpRepoBase, 'package.json');
    await writeJson({ name: 'tmp-repo' }, packagePath);

    const input = path.resolve(tmpRepoBase, 'some/sub/directory');
    const actual = await current(input);
    const packageJson = await readJson(path.resolve(actual, 'package.json'));
    expect(packageJson).toHaveProperty('name', 'tmp-repo');
  });
  it('should allow changing the reference dir as a filepath', async () => {
    const tmpRepoBase = tmpDirectory();
    const packagePath = path.resolve(tmpRepoBase, 'package.json');
    await writeJson({ name: 'tmp-repo' }, packagePath);

    const input = path.resolve(tmpRepoBase, 'some/sub/directory/somefile.png');
    const actual = await current(input);
    const packageJson = await readJson(path.resolve(actual, 'package.json'));
    expect(packageJson).toHaveProperty('name', 'tmp-repo');
  });
});

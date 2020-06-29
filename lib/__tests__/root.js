const current = require('../root');
const path = require('path');
const readJson = require('../readJson');

describe('root', () => {
  it('should return the root folder', async () => {
    const actual = await current();
    const packageJson = await readJson(path.resolve(actual, 'package.json'));
    expect(packageJson).toHaveProperty('name', 'firost');
  });
});

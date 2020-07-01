const current = require('../tmpDirectory');
const tmpFolder = require('tempy').root;

describe('tmpDirectory', () => {
  it('should return a directory in tmp folder', async () => {
    const actual = current();
    expect(actual).toStartWith(tmpFolder);
  });
  it('should allow passing a scope', async () => {
    const actual = current('firost');
    expect(actual).toStartWith(`${tmpFolder}/firost`);
  });
});

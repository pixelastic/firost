import current from '../helper.js';

describe('helper', () => {
  describe('getCommonParent', () => {
    it.each([
      // Static paths
      [['/tmp/one/two', '/tmp/one/three'], '/tmp/one'],
      [['/tmp/one/two', '/tmp'], '/tmp'],
      [['/tmp', '/tmp/one/two'], '/tmp'],
      [['/tmp/one/two', '/tmp/one/three', '/tmp/two'], '/tmp'],
      [['/tmp/one/two', '/tmp'], '/tmp'],
      // Simple glob
      [['/tmp/one/*', '/tmp/one/three/*'], '/tmp/one'],
      [['/tmp/one/*', '/tmp/*'], '/tmp'],
      [['/tmp/one/foo_*', '/tmp/one/bar_*'], '/tmp/one'],
      // Double glob
      [['/tmp/**', '/tmp/one/two'], '/tmp'],
      [['/tmp/one/**/foo', '/tmp/**/foo'], '/tmp'],
      // Single argument
      ['/tmp/one', '/tmp'],
      ['/tmp/*', '/tmp'],
      ['/tmp/one/**/*', '/tmp/one'],
    ])('%s is %s', async (input, expected) => {
      const actual = current.getCommonParent(input);
      expect(actual).toEqual(expected);
    });
  });
});

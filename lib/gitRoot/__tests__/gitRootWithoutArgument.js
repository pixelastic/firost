import current from '../gitRootWithoutArgument.js';
import gitRoot from '../index.js';

describe('gitRootWithoutArgument', () => {
  it('should return the same thing as the top-level gitRoot', async () => {
    const expected = gitRoot();
    const actual = current();
    expect(actual).toEqual(expected);
  });
  it('should throw an error if called without an argument', async () => {
    let actual = null;
    try {
      current('something');
    } catch (err) {
      actual = err;
    }

    expect(actual).toHaveProperty('code', 'ERROR_GIT_ROOT_SPECIFIED_ARGUMENT');
  });
});

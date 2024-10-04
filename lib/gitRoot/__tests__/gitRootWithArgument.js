import current from '../gitRootWithArgument.js';
import gitRoot from '../index.js';
import here from '../../here.js';

describe('gitRootWithArgument', () => {
  it('should return the same thing as the top-level gitRoot', async () => {
    const input = here();
    const expected = gitRoot(input);
    const actual = current(input);
    expect(actual).toEqual(expected);
  });
  it('should throw an error if called without an argument', async () => {
    let actual = null;
    try {
      current();
    } catch (err) {
      actual = err;
    }

    expect(actual).toHaveProperty('code', 'ERROR_GIT_ROOT_MISSING_ARGUMENT');
  });
});

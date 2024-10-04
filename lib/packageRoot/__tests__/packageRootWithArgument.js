import current from '../packageRootWithArgument.js';
import packageRoot from '../index.js';
import here from '../../here.js';

describe('packageRootWithArgument', () => {
  it('should return the same thing as the top-level packageRoot', async () => {
    const input = here();
    const expected = packageRoot(input);
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

    expect(actual).toHaveProperty(
      'code',
      'ERROR_PACKAGE_ROOT_MISSING_ARGUMENT',
    );
  });
});

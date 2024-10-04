import current from '../packageRootWithoutArgument.js';
import packageRoot from '../index.js';

describe('packageRootWithoutArgument', () => {
  it('should return the same thing as the top-level packageRoot', async () => {
    const expected = packageRoot();
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

    expect(actual).toHaveProperty(
      'code',
      'ERROR_PACKAGE_ROOT_SPECIFIED_ARGUMENT',
    );
  });
});

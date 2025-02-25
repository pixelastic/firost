import { packageRootWithArgument } from '../packageRootWithArgument.js';

describe('packageRootWithArgument', () => {
  // Note: We have no tests here to see if the return value is the one we
  // expect. This is because the code infers the packageRoot based on the
  // callstack, and if we were to call the file directly from here, it would
  // mess up the callstack.
  // Tests to see if the return value is correct are into tests of the wrapping
  // function.
  it('should throw an error if called without an argument', async () => {
    let actual = null;
    try {
      packageRootWithArgument();
    } catch (err) {
      actual = err;
    }

    expect(actual).toHaveProperty(
      'code',
      'ERROR_PACKAGE_ROOT_MISSING_ARGUMENT',
    );
  });
});

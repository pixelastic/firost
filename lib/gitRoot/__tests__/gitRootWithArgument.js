import { gitRootWithArgument } from '../gitRootWithArgument.js';

describe('gitRootWithArgument', () => {
  // Note: We have no tests here to see if the return value is the one we
  // expect. This is because the code infers the gitRoot based on the
  // callstack, and if we were to call the file directly from here, it would
  // mess up the callstack.
  // Tests to see if the return value is correct are into tests of the wrapping
  // function.
  it('should throw an error if called without an argument', async () => {
    let actual = null;
    try {
      gitRootWithArgument();
    } catch (err) {
      actual = err;
    }

    expect(actual).toHaveProperty('code', 'ERROR_GIT_ROOT_MISSING_ARGUMENT');
  });
});

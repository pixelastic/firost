import { gitRootWithoutArgument } from '../gitRootWithoutArgument.js';

describe('gitRootWithoutArgument', () => {
  // Note: We have no tests here to see if the return value is the one we
  // expect. This is because the code infers the gitRoot based on the
  // callstack, and if we were to call the file directly from here, it would
  // mess up the callstack.
  // Tests to see if the return value is correct are into tests of the wrapping
  // function.
  it('should throw an error if called with an argument', async () => {
    let actual = null;
    try {
      gitRootWithoutArgument('something');
    } catch (err) {
      actual = err;
    }

    expect(actual).toHaveProperty('code', 'ERROR_GIT_ROOT_SPECIFIED_ARGUMENT');
  });
});

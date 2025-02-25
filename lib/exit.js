/**
 * Wrapper around the raw process.exit() call, to make it easier to mock in tests
 * @param {string} errorCode Error code to return
 **/
export function exit(errorCode) {
  process.exit(errorCode);
}

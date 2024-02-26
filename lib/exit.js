/**
 * Wrapper around the raw process.exit() call, to make it easier to mock in tests
 * @param {string} errorCode Error code to return
 **/
export default function (errorCode) {
  /* eslint-disable n/no-process-exit */
  process.exit(errorCode);
  /* eslint-enable n/no-process-exit */
}
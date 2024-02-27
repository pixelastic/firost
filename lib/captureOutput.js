import stdMocks from 'std-mocks';
import stripAnsi from 'strip-ansi';

/**
 * Silence any output of the specified callback and return it instead
 * @param {Function} callback Method to capture the output of
 * @returns {object} Object with .stdout and .stderr keys
 **/
const captureOutput = async function (callback) {
  let stdout, stderr;

  try {
    stdMocks.use();
    await callback();
  } finally {
    const result = stdMocks.flush();
    stdMocks.restore();

    stdout = result.stdout;
    stderr = result.stderr;
  }
  return {
    stdout: captureOutput.clean(stdout),
    stderr: captureOutput.clean(stderr),
  };
};
captureOutput.clean = function (entries) {
  return entries.map((rawEntry) => {
    let entry = rawEntry;
    if (Buffer.isBuffer(entry)) {
      entry = entry.toString();
    }
    return stripAnsi(entry.replace(/\n$/g, ''));
  });
};
export default captureOutput;

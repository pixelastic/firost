import stdMocks from 'std-mocks';
import stripAnsi from 'strip-ansi';

export const __ = {
  clean,
};

/**
 * Silence any output of the specified callback and return it instead
 * @param {Function} callback Method to capture the output of
 * @returns {object} Object with .stdout and .stderr keys
 **/
export async function captureOutput(callback) {
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
    stdout: __.clean(stdout),
    stderr: __.clean(stderr),
  };
}

/**
 * Cleanup the output, so it's safe to display
 * @param {Array} entries stdout/stderr output to clean
 * @returns {Array} Cleaned output
 */
function clean(entries) {
  return entries.map((rawEntry) => {
    let entry = rawEntry;
    if (Buffer.isBuffer(entry)) {
      entry = entry.toString();
    }
    return stripAnsi(entry.replace(/\n$/g, ''));
  });
}

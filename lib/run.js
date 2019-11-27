import { _ } from 'golgoth';
import execa from 'execa';
import error from './error';

/**
 * @param {string} command Command to run
 * @param {object} userOptions Options to change behavior:
 * - shell (default: false) If set to true, enable shell syntax (&&, >, etc)
 *  -stdout (default: true) If set to false, will silence stdout
 *  -stderr (default: true) If set to false, will silence stderr
 * @returns {object} Returns an object with .stdout and .sterr, or throws on
 * error
 */
export default async function(command, userOptions = {}) {
  const options = {
    shell: false,
    stdout: true,
    stderr: true,
    ...userOptions,
  };
  const execaOptions = _.pick(options, ['shell']);

  try {
    const subprocess = execa.command(command, execaOptions);

    // Display output in realtime
    if (options.stdout) {
      subprocess.stdout.pipe(process.stdout);
    }
    if (options.stderr) {
      subprocess.stderr.pipe(process.stderr);
    }

    // Wait until the process is finished before returning the output
    const result = await subprocess;
    return _.pick(result, ['stdout', 'stderr']);
  } catch (err) {
    const newError = error(err.exitCode, err.message);
    newError.stdout = err.stdout;
    newError.stderr = err.stderr;
    throw newError;
  }
}

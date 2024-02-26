import { _ } from 'golgoth';
import execa from 'execa';
import error from './error.js';

/**
 * @param {string} command Command to run
 * @param {object} userOptions Options to change behavior:
 * - stdout (default: true) If set to false, will silence stdout
 * - stderr (default: true) If set to false, will silence stderr
 * - stdin (default: false) If set to true, user can input with keyboard
 * Also allows for execa-specific options, like:
 * - shell (default: false) If set to true, enable shell syntax (&&, >, etc)
 * - pwd (default: current directory) Change the working directory
 * - env (default: {}) Environement variables to overwrite
 * @returns {object} Returns an object with .stdout and .sterr, or throws on
 * error
 */
async function run(command, userOptions = {}) {
  const options = {
    shell: false,
    stdout: true,
    stderr: true,
    stdin: false,
    ...userOptions,
  };
  const execaOptions = _.omit(options, ['stdout', 'stderr', 'stdin']);

  /**
   * Run the command but allowing the user to input stuff from the keyboard
   * It seems to bypass the node script and write content to the top level
   * terminal
   * @returns {object} .stdout and .stdin of the process
   **/
  async function withStdin() {
    execaOptions.stdio = 'inherit';
    return await run.__command(command, execaOptions);
  }

  /**
   * Run the command and potentially hide stdout and stderr
   * @returns {object} .stdout and .stdin of the process
   **/
  async function withoutStdin() {
    const subprocess = run.__command(command, execaOptions);

    // Display output in realtime
    if (options.stdout) {
      subprocess.stdout.pipe(process.stdout);
    }
    if (options.stderr) {
      subprocess.stderr.pipe(process.stderr);
    }

    // Wait until the process is finished before returning the output
    return await subprocess;
  }

  try {
    const result = options.stdin ? await withStdin() : await withoutStdin();

    return _.pick(result, ['stdout', 'stderr']);
  } catch (err) {
    const newError = error(err.exitCode, err.message);
    newError.stdout = err.stdout;
    newError.stderr = err.stderr;
    throw newError;
  }
}
run.__command = execa.command;

export default run;

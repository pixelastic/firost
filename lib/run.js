import { _ } from 'golgoth';
import execa from 'execa';
import error from './error';

/**
 * @param command
 * @param userOptions
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

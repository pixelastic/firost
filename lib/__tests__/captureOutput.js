import colors from 'yoctocolors';
import { absolute } from '../absolute.js';
import { captureOutput } from '../captureOutput.js';
import { emptyDir } from '../emptyDir.js';
import { isFile } from '../isFile.js';
import { newFile } from '../newFile/index.js';
import { run } from '../run.js';
import { firostRoot } from '../test-helpers/firostRoot.js';

describe('captureOutput', () => {
  const tmpDirectory = absolute(firostRoot, '/tmp/captureOutput');
  beforeEach(async () => {
    await emptyDir(tmpDirectory);
  });

  it('should return stdout and stderr', async () => {
    const actual = await captureOutput(() => {
      process.stdout.write('Output');
      process.stderr.write('Error');

      process.stdout.write('Second output line');
      process.stderr.write('Second error line');
    });
    expect(actual).toHaveProperty('stdout', ['Output', 'Second output line']);
    expect(actual).toHaveProperty('stderr', ['Error', 'Second error line']);
  });
  it('should work with async methods', async () => {
    const actual = await captureOutput(async () => {
      const outputPath = `${tmpDirectory}/file.png`;
      await newFile(outputPath);
      const result = await isFile(outputPath);
      process.stdout.write(`${result}`);
    });
    expect(actual).toHaveProperty('stdout', ['true']);
  });
  it('should work with shell scripts', async () => {
    const actual = await captureOutput(async () => {
      await run('echo "error" 1>&2', { shell: true });
      await run('echo "output"', { shell: true });
    });
    expect(actual).toHaveProperty('stderr', ['error']);
    expect(actual).toHaveProperty('stdout', ['output']);
  });
  it('should remove ANSI characters', async () => {
    const actual = await captureOutput(() => {
      process.stdout.write(colors.red('foo'));
    });

    expect(actual).toHaveProperty('stdout', ['foo']);
  });
  it('should trim trailing newlines', async () => {
    const actual = await captureOutput(() => {
      process.stdout.write('foo\n');
    });

    expect(actual).toHaveProperty('stdout', ['foo']);
  });
  it('should discard previous capture after a call', async () => {
    await captureOutput(() => {
      process.stdout.write('foo');
    });
    const actual = await captureOutput(() => {
      process.stdout.write('bar');
    });

    expect(actual).toHaveProperty('stdout', ['bar']);
  });
  it('should discard previous capture after a failed', async () => {
    try {
      await captureOutput(() => {
        process.stdout.write('foo');
        throw new Error();
      });
    } catch (_err) {
      // Swallowing the error
    }

    const actual = await captureOutput(() => {
      process.stdout.write('bar');
    });

    expect(actual).toHaveProperty('stdout', ['bar']);
  });
});

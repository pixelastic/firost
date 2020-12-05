const current = require('../captureOutput');
const isFile = require('../isFile');
const run = require('../run');
const chalk = require('golgoth/chalk');

describe('captureOutput', () => {
  it('should return stdout and stderr', async () => {
    const actual = await current(() => {
      process.stdout.write('Output');
      process.stderr.write('Error');

      process.stdout.write('Second output line');
      process.stderr.write('Second error line');
    });
    expect(actual).toHaveProperty('stdout', ['Output', 'Second output line']);
    expect(actual).toHaveProperty('stderr', ['Error', 'Second error line']);
  });
  it('should work with async methods', async () => {
    const actual = await current(async () => {
      const result = await isFile(__filename);
      process.stdout.write(`${result}`);
    });
    expect(actual).toHaveProperty('stdout', ['true']);
  });
  it('should work with shell scripts', async () => {
    const actual = await current(async () => {
      await run('echo "error" 1>&2', { shell: true });
      await run('echo "output"', { shell: true });
    });
    expect(actual).toHaveProperty('stderr', ['error']);
    expect(actual).toHaveProperty('stdout', ['output']);
  });
  it('should remove ANSI characters', async () => {
    const actual = await current(() => {
      process.stdout.write(chalk.red('foo'));
    });

    expect(actual).toHaveProperty('stdout', ['foo']);
  });
  it('should trim trailing newlines', async () => {
    const actual = await current(() => {
      process.stdout.write('foo\n');
    });

    expect(actual).toHaveProperty('stdout', ['foo']);
  });
  it('should discard previous capture after a call', async () => {
    await current(() => {
      process.stdout.write('foo\n');
    });
    const actual = await current(() => {
      process.stdout.write('bar\n');
    });

    expect(actual).toHaveProperty('stdout', ['bar']);
  });
  it('should discard previous capture after a failed', async () => {
    try {
      await current(() => {
        process.stdout.write('foo\n');
        throw new Error();
      });
    } catch (err) {
      // Swallowing the error
    }

    const actual = await current(() => {
      process.stdout.write('bar\n');
    });

    expect(actual).toHaveProperty('stdout', ['bar']);
  });
});

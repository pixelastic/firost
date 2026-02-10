import { mkdirp } from '../mkdirp.js';
import { __, run } from '../run.js';
import { tmpDirectory } from '../tmpDirectory.js';

describe('run', () => {
  describe('on success', () => {
    it('should return a .stdout key', async () => {
      let actual;
      await captureOutput(async () => {
        actual = await run('echo foo');
      });

      expect(actual).toHaveProperty('stdout', 'foo');
    });
    it('should return a .stderr key', async () => {
      let actual;
      await captureOutput(async () => {
        actual = await run('>&2 echo bar', { shell: true });
      });

      expect(actual).toHaveProperty('stderr', 'bar');
    });
    it('should correctly parse command string into file and arguments', async () => {
      vi.spyOn(__, 'execa');
      await captureOutput(async () => {
        await run('echo foo bar');
      });

      expect(__.execa).toHaveBeenCalledWith('echo', ['foo', 'bar'], {
        shell: false,
      });
    });
  });
  describe('on error', () => {
    it('should throw with message', async () => {
      let actual;
      try {
        await run('false');
      } catch (err) {
        actual = err;
      }

      expect(actual).toHaveProperty(
        'message',
        'Command failed with exit code 1: false',
      );
    });
    it('should throw with exitCode as the code', async () => {
      let actual;
      try {
        await run('exit 42', { shell: true });
      } catch (err) {
        actual = err;
      }

      expect(actual).toHaveProperty('code', 'FIROST_RUN_EXIT_CODE_42');
    });
    it('should have stdout in the error message', async () => {
      let actual;
      try {
        await captureOutput(async () => {
          await run('echo foo && false', { shell: true });
        });
      } catch (err) {
        actual = err;
      }

      expect(actual).toHaveProperty('stdout', 'foo');
    });
    it('should have stderr in the error message', async () => {
      let actual;
      try {
        await captureOutput(async () => {
          await run('>&2 echo bar && false', { shell: true });
        });
      } catch (err) {
        actual = err;
      }

      expect(actual).toHaveProperty('stderr', 'bar');
    });
  });
  it('should allow forcing a shell to use shell-specific syntax', async () => {
    const actual = await captureOutput(async () => {
      await run('echo foo && echo bar', { shell: true });
    });

    expect(actual).toHaveProperty('stdout', ['foo\nbar']);
  });
  it('should allow passing arguments in quotes', async () => {
    const actual = await captureOutput(async () => {
      await run('echo "foo bar"', { shell: true });
    });

    expect(actual).toHaveProperty('stdout', ['foo bar']);
  });
  it('should forward stdout to output', async () => {
    const actual = await captureOutput(async () => {
      await run('echo foo');
    });

    expect(actual).toHaveProperty('stdout', ['foo']);
  });
  it('should silence stdout with stdout: false', async () => {
    const actual = await captureOutput(async () => {
      await run('echo foo', { stdout: false });
    });

    expect(actual).toHaveProperty('stdout', []);
  });
  it('should forward stderr to output', async () => {
    const actual = await captureOutput(async () => {
      await run('>&2 echo bar', { shell: true });
    });

    expect(actual).toHaveProperty('stderr', ['bar']);
  });
  it('should silence stderr with stderr: false', async () => {
    const actual = await captureOutput(async () => {
      await run('>&2 echo bar', { shell: true, stderr: false });
    });

    expect(actual).toHaveProperty('stderr', []);
  });
  it('should set stdio to inherit if stdin is true', async () => {
    vi.spyOn(__, 'execa');
    await captureOutput(async () => {
      await run('true', { stdin: true });
    });

    expect(__.execa).toHaveBeenCalledWith(
      'true',
      [],
      expect.objectContaining({ stdio: 'inherit' }),
    );
  });
  it('should allow overriding ENV variables', async () => {
    let actual;
    await captureOutput(async () => {
      actual = await run('echo $FIROST_TEST_VARIABLE', {
        shell: true,
        env: {
          FIROST_TEST_VARIABLE: 'good',
        },
      });
    });

    expect(actual).toHaveProperty('stdout', 'good');
  });
  it('should allow removing ENV variables', async () => {
    let actual;
    await captureOutput(async () => {
      actual = await run('echo "Home:$HOME"', {
        shell: true,
        env: {
          HOME: undefined,
        },
      });
    });

    expect(actual).toHaveProperty('stdout', 'Home:');
  });
  it('should allow changing the run working directory', async () => {
    const cwd = tmpDirectory('firost/run');
    await mkdirp(cwd);

    let actual;
    await captureOutput(async () => {
      actual = await run('pwd', {
        shell: true,
        cwd,
      });
    });

    expect(actual).toHaveProperty('stdout', cwd);
  });
  it('should use ENV variables from process.env', async () => {
    let actual;
    const processEnvBackup = { ...process.env };
    process.env.FIROST_TEST_VARIABLE = 'good';
    await captureOutput(async () => {
      actual = await run('echo $FIROST_TEST_VARIABLE', {
        shell: true,
      });
    });
    process.env = processEnvBackup;

    expect(actual).toHaveProperty('stdout', 'good');
  });
});

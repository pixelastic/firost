const current = require('../run');

describe('run', () => {
  describe('on success', () => {
    it('should return a .stdout key', async () => {
      let actual;
      await captureOutput(async () => {
        actual = await current('echo foo');
      });

      expect(actual).toHaveProperty('stdout', 'foo');
    });
    it('should return a .stderr key', async () => {
      let actual;
      await captureOutput(async () => {
        actual = await current('>&2 echo bar', { shell: true });
      });

      expect(actual).toHaveProperty('stderr', 'bar');
    });
  });
  describe('on error', () => {
    it('should throw with message', async () => {
      let actual;
      try {
        await current('false');
      } catch (err) {
        actual = err;
      }

      expect(actual).toHaveProperty(
        'message',
        'Command failed with exit code 1: false'
      );
    });
    it('should throw with exitCode as the code', async () => {
      let actual;
      try {
        await current('exit 42', { shell: true });
      } catch (err) {
        actual = err;
      }

      expect(actual).toHaveProperty('code', 42);
    });
    it('should have stdout in the error message', async () => {
      let actual;
      try {
        await captureOutput(async () => {
          await current('echo foo && false', { shell: true });
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
          await current('>&2 echo bar && false', { shell: true });
        });
      } catch (err) {
        actual = err;
      }

      expect(actual).toHaveProperty('stderr', 'bar');
    });
  });
  it('should allow forcing a shell to use shell-specific syntax', async () => {
    const actual = await captureOutput(async () => {
      await current('echo foo && echo bar', { shell: true });
    });

    expect(actual).toHaveProperty('stdout', ['foo\nbar']);
  });
  it('should allow passing arguments in quotes', async () => {
    const actual = await captureOutput(async () => {
      await current('echo "foo bar"', { shell: true });
    });

    expect(actual).toHaveProperty('stdout', ['foo bar']);
  });
  it('should forward stdout to output', async () => {
    const actual = await captureOutput(async () => {
      await current('echo foo');
    });

    expect(actual).toHaveProperty('stdout', ['foo']);
  });
  it('should silence stdout with stdout: false', async () => {
    const actual = await captureOutput(async () => {
      await current('echo foo', { stdout: false });
    });

    expect(actual).toHaveProperty('stdout', []);
  });
  it('should forward stderr to output', async () => {
    const actual = await captureOutput(async () => {
      await current('>&2 echo bar', { shell: true });
    });

    expect(actual).toHaveProperty('stderr', ['bar']);
  });
  it('should silence stderr with stderr: false', async () => {
    const actual = await captureOutput(async () => {
      await current('>&2 echo bar', { shell: true, stderr: false });
    });

    expect(actual).toHaveProperty('stderr', []);
  });
  it('should set stdio to inherit if stdin is true', async () => {
    jest.spyOn(current, '__command');
    await captureOutput(async () => {
      await current('true', { stdin: true });
    });

    expect(current.__command).toHaveBeenCalledWith(
      'true',
      expect.objectContaining({ stdio: 'inherit' })
    );
  });
});

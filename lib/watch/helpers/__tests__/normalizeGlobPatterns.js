import { absolute } from '../../../absolute.js';
import { firostRoot } from '../../../test-helpers/firostRoot.js';
import { normalizeGlobPatterns } from '../normalizeGlobPatterns.js';

describe('normalizeGlobPatterns', () => {
  const tmpDir = absolute(firostRoot, '/tmp/watch/helper');

  it('should transform single input to array', () => {
    const input = './file.js';
    const expected = [`${tmpDir}/file.js`];

    const actual = normalizeGlobPatterns(input, tmpDir);
    expect(actual).toEqual(expected);
  });

  it('should handle complex array with all possible cases', () => {
    const input = [
      './src/index.js',
      '/tmp/file.txt',
      './lib/**/*.js',
      '/var/log/*.log',
      '!./node_modules',
      '!/tmp/cache',
      '!./dist/**/*',
      '!/opt/ignore/**/*.tmp',
    ];

    const expected = [
      `${tmpDir}/src/index.js`,
      '/tmp/file.txt',
      `${tmpDir}/lib/**/*.js`,
      '/var/log/*.log',
      `!${tmpDir}/node_modules`,
      '!/tmp/cache',
      `!${tmpDir}/dist/**/*`,
      '!/opt/ignore/**/*.tmp',
    ];

    const actual = normalizeGlobPatterns(input, tmpDir);
    expect(actual).toEqual(expected);
  });
});

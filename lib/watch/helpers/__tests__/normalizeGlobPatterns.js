import { tmpDirectory } from 'firost';
import { normalizeGlobPatterns } from '../normalizeGlobPatterns.js';

describe('normalizeGlobPatterns', () => {
  const testDirectory = tmpDirectory(`firost/watch/${describeName}`);

  it('should transform single input to array', () => {
    const input = './file.js';
    const expected = [`${testDirectory}/file.js`];

    const actual = normalizeGlobPatterns(input, testDirectory);
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
      `${testDirectory}/src/index.js`,
      '/tmp/file.txt',
      `${testDirectory}/lib/**/*.js`,
      '/var/log/*.log',
      `!${testDirectory}/node_modules`,
      '!/tmp/cache',
      `!${testDirectory}/dist/**/*`,
      '!/opt/ignore/**/*.tmp',
    ];

    const actual = normalizeGlobPatterns(input, testDirectory);
    expect(actual).toEqual(expected);
  });
});

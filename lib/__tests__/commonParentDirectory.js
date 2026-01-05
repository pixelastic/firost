import { commonParentDirectory } from '../commonParentDirectory.js';

describe('commonParentDirectory', () => {
  it.each([
    [
      'Nominal case',
      [
        '/path/to/somewhere/src/__tests__/main.js',
        '/path/to/somewhere/main.js',
        '/path/to/somewhere/tool.config.js',
      ],
      '/path/to/somewhere',
    ],
    // Limits
    [
      'No common parent except root',
      ['/path/to/somewhere/lib/main.js', '/completely/different'],
      '/',
    ],
    ['Empty input', [], false],
    [
      'Empty elements',
      ['/path/to/somewhere/src/__tests__/main.js', null],
      '/path/to/somewhere/src/__tests__',
    ],
    ['Only one path', ['/path/to/somewhere/lib'], '/path/to/somewhere'],
    // Input as string
    ['Input as string dir', '/path/to/somewhere/lib', '/path/to/somewhere'],
    [
      'Input as string file',
      '/path/to/somewhere/lib/main.js',
      '/path/to/somewhere/lib',
    ],
    // Globs
    ['Only a glob', '/path/to/somewhere/**/**', '/path/to/somewhere'],
    [
      '/path/with/glob/*',
      ['/path/to/somewhere/lib/*', '/path/to/somewhere/lib/src/__tests__'],
      '/path/to/somewhere/lib',
    ],
    [
      '/lib/* && /lib/src/*',
      ['/path/to/somewhere/lib/*', '/path/to/somewhere/lib/src/*'],
      '/path/to/somewhere/lib',
    ],
    [
      '/lib/foo_* && /lib/bar_*',
      ['/path/to/somewhere/foo_*', '/path/to/somewhere/lib/bar_*'],
      '/path/to/somewhere',
    ],
    [
      'Double globs in deep subdir and parent',
      ['/path/to/somewhere/**', '/path/to/somewhere/lib'],
      '/path/to/somewhere',
    ],
    [
      'Double globs in the middle',
      ['/path/to/somewhere/lib/**/foo', '/path/to/somewhere/**/foo'],
      '/path/to/somewhere',
    ],
    // Misc
    [
      'Dirs and files',
      ['/path/to/somewhere/lib/main.js', '/path/to/somewhere/lib'],
      '/path/to/somewhere/lib',
    ],
    [
      'Only one directory different',
      [
        '/path/to/somewhere/alpha/beta/gamma',
        '/path/to/somewhere/alpha/nopenopenope/gamma',
      ],
      '/path/to/somewhere/alpha',
    ],
  ])('%s', async (_title, input, expected) => {
    const actual = commonParentDirectory(input);
    expect(actual).toEqual(expected);
  });
});

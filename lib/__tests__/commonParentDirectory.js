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
    ['Input as string dir', '/path/to/somewhere/lib', '/path/to/somewhere'],
    [
      'Input as string file',
      '/path/to/somewhere/lib/main.js',
      '/path/to/somewhere/lib',
    ],
    ['Only one path', ['/path/to/somewhere/lib'], '/path/to/somewhere'],
    [
      'Dirs and files',
      ['/path/to/somewhere/lib/main.js', '/path/to/somewhere/lib'],
      '/path/to/somewhere/lib',
    ],
  ])('%s', async (_title, input, expected) => {
    const actual = commonParentDirectory(input);
    expect(actual).toEqual(expected);
  });
});

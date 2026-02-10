module.exports = {
  navigation: [
    {
      name: 'Filesystem',
      links: [
        'copy',
        'emptyDir',
        'exists',
        'isDirectory',
        'isFile',
        'isSymlink',
        'mkdirp',
        'newFile',
        'move',
        'read',
        'remove',
        'symlink',
        'write',
      ],
    },
    {
      name: 'Filepath',
      links: ['absolute', 'callerDir', 'commonParentDirectory', 'dirname', 'gitRoot', 'glob', 'here', 'packageRoot', 'tmpDirectory'],
    },
    {
      name: 'URLs',
      links: ['download', 'isUrl', 'normalizeUrl', 'readUrl', 'urlToFilepath'],
    },
    {
      name: 'JSON',
      links: ['readJsonUrl', 'readJson', 'writeJson'],
    },
    {
      name: 'Commands',
      links: ['run', 'which', 'env', 'exit', 'prompt', 'select', 'spinner'],
    },
    {
      name: 'Watchers',
      links: ['unwatchAll', 'unwatch', 'waitForWatchers', 'watch'],
    },
    {
      name: 'Utils',
      links: [
        'cache',
        'callstack',
        'captureOutput',
        'firostError',
        'firostImport',
        'hash',
        'sleep',
        'uuid',
        'wrap',
      ],
    },
    {
      name: 'Console',
      links: ['consoleError', 'consoleInfo', 'consoleSuccess', 'consoleWarn'],
    },
  ],
  docSearch: {
    apiKey: '068537f2f0092021a76033dfeef83f33',
    indexName: 'pixelastic_firost',
  },
};

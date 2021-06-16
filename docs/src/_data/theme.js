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
        'move',
        'read',
        'remove',
        'symlink',
        'write',
      ],
    },
    {
      name: 'Filepath',
      links: ['absolute', 'gitRoot', 'glob', 'packageRoot', 'tmpDirectory'],
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
      links: ['run', 'which', 'env', 'exit', 'prompt', 'spinner'],
    },
    {
      name: 'Watchers',
      links: ['unwatchAll', 'unwatch', 'waitForWatchers', 'watch'],
    },
    {
      name: 'Utils',
      links: ['captureOutput', 'require', 'sleep', 'uuid', 'error'],
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

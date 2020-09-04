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
        'mkdirp',
        'read',
        'remove',
        'write',
      ],
    },
    {
      name: 'Filepath',
      links: ['absolute', 'gitRoot', 'glob', 'packageRoot', 'tmpDirectory'],
    },
    {
      name: 'URLs',
      links: ['download', 'normalizeUrl', 'urlToFilepath'],
    },
    {
      name: 'JSON',
      links: ['writeJson', 'readJson', 'readJsonUrl'],
    },
    {
      name: 'Commands',
      links: ['run', 'which', 'exit', 'prompt', 'spinner'],
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
};

module.exports = {
  hooks: {
    precommit: 'yarn run lint',
    prepush: 'yarn run test',
  },
};

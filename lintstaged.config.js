import config from 'aberlaas/configs/lintstaged';

export default {
  ...config,
  // Simple lint --fix with type flags
  '*.css': ['yarn run lint --fix --css'],
  '*.{yml,yaml}': ['yarn run lint --fix --yml'],
  '*.json': ['yarn run lint --fix --json'],
  '*.js': ['yarn run lint --fix --js'],
};

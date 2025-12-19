import config from 'aberlaas/configs/lintstaged';

export default {
  ...config,
  // Override to use :direct variants to bypass turbo during pre-commit
  // (turbo doesn't accept aberlaas flags like --json, --css, etc.)
  '*.css': ['yarn run lint:fix:direct --css'],
  '*.{yml,yaml}': ['yarn run lint:fix:direct --yml'],
  '*.json': ['yarn run lint:fix:direct --json'],
  '*.js': ['yarn run lint:fix:direct --js'],
};

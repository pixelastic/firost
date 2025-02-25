import { _ } from 'golgoth';

/**
 * Wrapper to read environment variables, to make it easier to mock in tests
 * @param {string} name Environment variable name
 * @param {any} fallbackValue Fallback value if ENV is empty
 * @returns {string} Value of the environment variable
 **/
export function env(name, fallbackValue) {
  return _.get(process, `env.${name}`, fallbackValue);
}

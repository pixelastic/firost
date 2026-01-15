import { _ } from 'golgoth';
/**
 * Wrap a method in another method.
 * This is useful in tests, to be able to tap in and mock internal parts while
 * keeping the same public interface.
 * @param {Function} method Original method to wrap
 * @returns {Function} Wrapped method
 **/
export function wrap(method) {
  if (!_.isFunction(method)) {
    return method;
  }

  const functionType = method.constructor.name;
  // Async
  if (functionType === 'AsyncFunction') {
    return async function (...args) {
      return await method(...args);
    };
  }

  // Sync
  return function (...args) {
    return method(...args);
  };
}

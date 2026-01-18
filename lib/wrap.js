import { _ } from 'golgoth';
import { firostError } from './firostError.js';
/**
 * Wraps a method from a parent object (async or sync).
 * This is useful in tests, to be able to tap in and mock internal parts while
 * keeping the same public interface.
 * @param {object} parentObject - The object containing the method to wrap
 * @param {string} methodName - The name of the method to wrap
 * @returns {Function|any} The wrapped function or the original value if not a function
 */
export function wrap(parentObject, methodName) {
  const method = parentObject[methodName];
  if (!_.isFunction(method)) {
    throw firostError(
      'FIROST_WRAP_NOT_A_FUNCTION',
      'The specified key is not a function',
    );
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

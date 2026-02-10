import { setTimeout } from 'node:timers/promises';

/**
 * Wait a specific amount of time
 * @param {number} delay Delay to wait, in milliseconds
 * @returns {Promise} Resolved after the specified delay
 **/
export function sleep(delay) {
  return setTimeout(delay);
}

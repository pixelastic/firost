/**
 * Wait a specific amount of time
 * @param {number} delay Delay to wait, in milliseconds
 * @returns {Promise} Resolved after the specified delay
 **/
const module = function(delay) {
  return new Promise(resolve => {
    setTimeout(resolve, delay);
  });
};
export default module;

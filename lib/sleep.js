/**
 * Wait a specific amount of time
 * @param {number} delay Delay to wait, in milliseconds
 * @returns {Promise} Resolved after the specified delay
 **/
module.exports = function(delay) {
  return new Promise(resolve => {
    setTimeout(resolve, delay);
  });
};

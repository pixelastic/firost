/**
 * Utility function to return errors containing a code (like fs-extra is
 * doing) and a message
 * @param {string} errorCode Error code
 * @param {string} errorMessage Error message
 * @returns {Error} new Error with .code and .message set
 **/
module.exports = function error(errorCode, errorMessage) {
  const newError = new Error(errorMessage);
  newError.code = errorCode;
  newError.message = errorMessage;
  return newError;
};

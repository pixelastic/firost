/**
 * Utility function to return errors containing a code (like fs-extra is
 * doing) and a message
 * @param {String} errorCode Error code
 * @param {String} errorMessage Error message
 * @returns {Error} new Error with .code and .message set
 **/
const module = function error(errorCode, errorMessage) {
  const newError = new Error(errorMessage);
  newError.code = errorCode;
  newError.message = errorMessage;
  return newError;
};
export default module;

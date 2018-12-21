import copyOrMove from './copyOrMove';

/**
 * Move files from source to destination
 * @param {String} source Path (or glob) to the source file(s)
 * @param {String} destination Path to the destination file
 * @returns {Void}
 **/
const module = copyOrMove('move');
export default module;

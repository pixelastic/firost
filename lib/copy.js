import copyOrMove from './copyOrMove';

/**
 * Copy files from source to destination
 * @param {string} source Path (or glob) to the source file(s)
 * @param {string} destination Path to the destination file
 **/
const module = copyOrMove('copy');
export default module;

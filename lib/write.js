import fs from 'fs-extra';
import path from 'path';
import mkdirp from './mkdirp';

/**
 * Write some content to disk
 * @param {String} content Content to write to the file
 * @param {String} destination Destination filepatth
 * @returns {Void}
 * Note: It will create the directories if needed
 **/
const module = async function write(content, destination) {
  await mkdirp(path.dirname(destination));
  await fs.writeFile(destination, content);
};

export default module;

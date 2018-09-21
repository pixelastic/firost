import stringify from 'json-stable-stringify';
import _ from 'lodash';
import fs from 'fs-extra';
import path from 'path';
import glob from 'glob';
import pify from 'pify';

const module = {
  /**
   * Wrapper around glob() to work as a promise
   * @param {String} pattern Glob pattern to match
   * @returns {Array} Array of files matching
   **/
  async glob(pattern) {
    if (!this._glob) {
      this._glob = pify(glob);
    }
    const matches = await this._glob(pattern);
    // Sort results by lexicographic order (ie. foo_2 will be before foo_10)
    return matches.sort((a, b) => a.localeCompare(b, 'en', { numeric: true }));
  },

  /**
   * Wrapper around fs.mkdirp to work as a promise
   * @param {String} dirpath Directory path to create
   * @returns {Void}
   **/
  async mkdirp(dirpath) {
    if (!this._mkdirp) {
      this._mkdirp = pify(fs.mkdirp);
    }
    return await this._mkdirp(dirpath);
  },

  /**
   * Read any file on disk
   * @param {String} filepath Filepath of the file to read
   * @returns {String} Content of the file read
   **/
  async read(filepath) {
    if (!this._readFile) {
      this._readFile = pify(fs.readFile);
    }
    return await this._readFile(filepath);
  },

  /**
   * Read a JSON file on disk and return its parsed content.
   * @param {String} source Path to the Json file
   * @return {Promise.<Object>} The parsed content of the Json file
   * Will return null if the file does not exist or is not Json
   **/
  async readJson(source) {
    try {
      const content = await this.read(source);
      return JSON.parse(content);
    } catch (err) {
      return null;
    }
  },

  /**
   * Write some content to disk
   * @param {String} destination Destination filepatth
   * @param {String} content Content to write to the file
   * @returns {Void}
   * Note: It will create the directories if needed
   **/
  async write(destination, content) {
    if (!this._writeFile) {
      this._writeFile = pify(fs.writeFile);
    }
    await this.mkdirp(path.dirname(destination));
    await this._writeFile(destination, content);
    return;
  },

  /**
   * Writes an object to JSON on disk
   * @param {String} destination Filepath to write the file to
   * @param {Object} data Object to convert to json and write to disk
   * @returns {Void}
   **/
  async writeJson(destination, data) {
    const content = stringify(data, { space: 2 });
    await this.write(destination, content);
    return;
  },
};

export default _.bindAll(module, _.functions(module));

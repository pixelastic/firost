import stringify from 'json-stable-stringify';
import _ from 'lodash';
import url from 'url';
import qs from 'query-string';
import ora from 'ora';
import fs from 'fs-extra';
import got from 'got';
import glob from 'glob';
import path from 'path';
import pify from 'pify';
import shelljs from 'shelljs';

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
   * Download the file at the specified url to disk
   * @param {String} destination Path on disk to save it to
   * @param {String} inputUrl Url of the file to download
   * @returns {Void}
   **/
  async download(destination, inputUrl) {
    return await new Promise((resolve, reject) => {
      const writeStream = fs.createWriteStream(destination);
      writeStream.on('finish', () => {
        resolve();
      });
      try {
        got.stream(inputUrl).pipe(writeStream);
      } catch (err) {
        reject(err);
      }
    });
  },

  /**
   * Check if the specific path is a directory
   * @param {String} userPath Path to check
   * @returns {Boolean} If the path is a directory
   **/
  async isDirectory(userPath) {
    if (!fs.existsSync(userPath)) {
      return false;
    }
    if (!this._lstat) {
      this._lstat = pify(fs.lstat);
    }
    const stats = await this._lstat(userPath);
    return stats.isDirectory();
  },

  /**
   * Check if the specific path is a file
   * @param {String} userPath Path to check
   * @returns {Boolean} If the path is a file
   **/
  async isFile(userPath) {
    if (!fs.existsSync(userPath)) {
      return false;
    }
    if (!this._lstat) {
      this._lstat = pify(fs.lstat);
    }
    const stats = await this._lstat(userPath);
    return stats.isFile();
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
   * Returns a spinner to display progress of any task
   * @param {Number} total Max number of items to execute
   * @returns {Object} Spinner object, coming with two methods:
   *  .tick(text) Increment the spinner by one and display the text
   *  .succeed(text) Stop the spinner and display a success message
   **/
  spinner(total) {
    const spinner = ora();
    spinner.max = total;
    spinner.current = 0;
    spinner.start();

    return {
      tick(userText) {
        const current = ++spinner.current;
        const max = spinner.max;
        const displayText = `[${current}/${max}] ${userText}`;
        spinner.text = displayText;
      },
      succeed(userText) {
        spinner.succeed(`[${spinner.current}/${spinner.max}] ${userText}`);
      },
    };
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
    const content = await this._readFile(filepath);
    return content.toString('utf8');
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
   * Read a json url and return its parsed content
   * @param {String} inputUrl Url to the JSON content
   * @return {Promise.<Object>} The parsed content of the Json file
   **/
  async readJsonUrl(inputUrl) {
    try {
      const response = await got(inputUrl);
      return JSON.parse(response.body);
    } catch (err) {
      return null;
    }
  },

  /**
   * Run a command in the shell
   * @param {String} command Command to run
   * @returns {Promise} Resolves with stdout if exit code is 0, otherewise reject
   * with sterr
   **/
  async shell(command) {
    return await new Promise((resolve, reject) => {
      shelljs.exec(
        command,
        { async: true, silent: true },
        (code, stdout, stderr) => {
          if (code === 0) {
            return resolve(_.trim(stdout));
          }
          return reject(_.trim(stderr));
        }
      );
    });
  },

  /**
   * Convert a url to a valid filepath
   * @param {String} input Input url
   * @param {Object} options
   *  - options.extension: If set, will force the file extension
   * @returns {String} Filepath
   * This will split the url in subdirectories and encode the querystring as
   * part of the file name, while keeping the extension
   **/
  urlToFilepath(input, options = {}) {
    const parsed = url.parse(input);

    const protocol = _.chain(parsed)
      .get('protocol')
      .replace(':', '')
      .value();
    const host = _.get(parsed, 'host');
    const urlPath = _.chain(parsed)
      .get('path')
      .split('/')
      .dropRight(1)
      .compact()
      .value();
    const filepath = _.concat([protocol, host], urlPath);

    const pathname = _.get(parsed, 'pathname');
    const originalExtname = path.extname(pathname);
    const customExtname = _.has(options, 'extension')
      ? `.${options.extension}`
      : null;
    const extname = customExtname || originalExtname;
    const basename = path.basename(_.get(parsed, 'pathname'), originalExtname);

    if (_.get(parsed, 'query')) {
      const query = _.chain(parsed)
        .get('query')
        .thru(qs.parse)
        .map((value, key) => ({ key, value }))
        .sortBy(['key'])
        .map(item => `${item.key}-${item.value}`)
        .join('_')
        .value();
      filepath.push(`${basename}_${query}${extname}`);
    } else {
      filepath.push(`${basename}${extname}`);
    }

    return _.join(filepath, '/');
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

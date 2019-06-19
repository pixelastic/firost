import fs from 'fs-extra';
import path from 'path';
import http from 'http';
import getPort from 'get-port';
import read from './read';
import exists from './exists';

const module = {
  /**
   * Return the path of the fixtures
   * @returns {string} Path to the fixtures
   **/
  fixturePath() {
    return path.resolve(path.join('./fixtures'));
  },
  /**
   * Returns a safe path where we can save/delete files.
   * @param {string} suffix Optional suffix directory. Default is "default"
   * @returns {string} Path to directory
   **/
  tmpPath(suffix = 'default') {
    return path.resolve(path.join('./tmp', suffix));
  },
  /**
   * Remove all content from the temp directory
   * @param {string} suffix Optional suffix directory. Default is "default"
   **/
  async clearTmpDirectory(suffix) {
    await fs.emptyDir(this.tmpPath(suffix));
  },

  /**
   * Start a server to serve static assets
   * @returns {object} Object with .url and .server keys.
   **/
  async startServer() {
    if (this.runningServer) {
      return false;
    }

    const serverPort = await getPort();
    const fixturePath = this.fixturePath();
    const onRequest = async function(request, response) {
      // We find a matching file in the fixture path, removing any query
      // string from the url
      const filepath = path.join(fixturePath, request.url.split('?')[0]);
      // If file does not exist, we return a 404
      if (!(await exists(filepath))) {
        response.writeHead(404);
        response.end();
        return;
      }

      // We return the file content
      const content = await read(filepath);
      response.end(content, 'utf-8');
    };
    const server = http.createServer(onRequest);

    // We wait until the server is ready to receive connections on the port, or
    // stop if it errors
    return await new Promise((resolve, reject) => {
      server.on('error', reject);
      server.listen(serverPort, () => {
        this.runningServer = server;
        resolve(`http://127.0.0.1:${serverPort}`);
      });
    });
  },

  /**
   * Close the running server and wait for its shutdown
   * @returns {Promise} Close event
   **/
  async closeServer() {
    return await new Promise(resolve => {
      this.runningServer.on('close', resolve);
      this.runningServer.close();
    });
  },

  /**
   * Returns a method to mock the specified module
   * @param {object} moduleToMock The module to mock
   * @returns {Function} Function to call with methodName and (optional) return value
   **/
  mock(moduleToMock) {
    return function(methodName, value) {
      return jest.spyOn(moduleToMock, methodName).mockReturnValue(value);
    };
  },
};

export default module;

import http from 'node:http';
import path from 'node:path';
import getPort from 'get-port';
import { exists } from '../exists.js';
import { read } from '../read.js';

export let __;
/**
 * Start a server to serve static assets
 * @param {string} servePath Path on disk to serve
 * @returns {object} Object with .url and .server keys.
 **/
export async function startServer(servePath) {
  if (__.runningServer) {
    return false;
  }

  const serverPort = await getPort();
  const onRequest = async function (request, response) {
    // We find a matching file in the fixture path, removing any query
    // string from the url
    const filepath = path.join(servePath, request.url.split('?')[0]);
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
      __.runningServer = server;
      resolve(`http://127.0.0.1:${serverPort}`);
    });
  });
}

/**
 * Close the running server and wait for its shutdown
 * @returns {Promise} Close event
 **/
export async function closeServer() {
  return await new Promise((resolve) => {
    __.runningServer.on('close', resolve);
    __.runningServer.close();
  });
}

__ = {
  runningServer: null,
};

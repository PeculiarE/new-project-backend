#!/usr/bin/env node
import 'core-js/stable';
import 'regenerator-runtime/runtime';

/**
 * Module dependencies.
 */

import app from '../app';
// var debug = require ('debug')('project-backend-generator:server');
import http from 'http';

/**
 * Normalize a port into a number, string, or false.
 */

 const normalizePort = (val) => {
  const port = parseInt(val, 10);

  // if (Number.isNaN(port)) {
  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

/**
 * Event listener for HTTP server "error" event.
 */

const onError = (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
    ? `Pipe ${port}`
    : `Port ${port}`

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

const onListening = () => {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? `pipe ${addr}`
    : `port ${addr.port}`;
  // debug(`Listening on ${bind}`);
  console.log(`Listening on ${bind}`);
}

/**
 * Listen on provided port, on all network interfaces.
 */

 server.listen(port);
 server.on('error', onError);
 server.on('listening', onListening);

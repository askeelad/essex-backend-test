let app = require('../app');
let debug = require('debug')('mern-stack:server');
let http = require('http');
// const { prisma } = require('../config/db');

/**
 * Get port from environment and store in Express.
 */

let port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

let server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Handle graceful shutdown
 * This will ensure that the server closes all connections and
 * Prisma disconnects from the database before exiting.
 * This is important to prevent data loss and ensure that all
 * requests are completed before the server shuts down.
 */
['SIGTERM', 'SIGINT'].forEach(signal => {
    process.on(signal, async () => {
      console.log(`${signal} received. Closing server...`);
      server.close(async () => {
        console.log('HTTP server closed.');
        // await prisma.$disconnect();
        console.log('Database connection closed.');
        process.exit(0);
      });
    });
  });

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  let port = parseInt(val, 10);

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
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  let bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  console.log('server running on port', port);
  let addr = server.address();
  let bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

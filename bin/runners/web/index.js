// const { logger } = require('logger');

const httpServer = require('./http');
const wsServer = require('./ws');

const init = async () => {
  console.log('Init web servers');
  const server = await httpServer();   
  await wsServer(server);
};

module.exports = init;

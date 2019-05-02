const path = require('path');
const domain = 'localhost';

module.exports = {
  app: {
    name: 'BaseApp',
    domain,
    rootDir: path.resolve(__dirname, '../'),
    tmpDir: path.resolve(__dirname, '../', 'tmp'),
  },
};

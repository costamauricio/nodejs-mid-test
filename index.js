'use strict';

// load environment configuration
require('dotenv').config();

const config = require('./config');
const api = require('./api');

api.listen(config.server.port, config.server.host, () => {
  console.log(`server listening at ${config.server.port}`);
});

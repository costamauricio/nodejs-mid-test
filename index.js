'use strict';

// load environment configuration
require('dotenv').config();

const config = require('config');
const api = require('api');
const db = require('db');

(async ()  => {

  try {
    await db.connect(`${config.db.host}:${config.db.port}/${config.db.name}`);

  } catch (err) {
    console.log('Database connection error', err);
    process.exit();
  }

  api.listen(config.server.port, config.server.host, () => {
    console.log(`server listening at ${config.server.port}`);
  });

})();

module.exports = api;

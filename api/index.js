'use strict';

const app = require('express')();
const importDir = require('import-dir');
const routes = importDir('./routes');

// load api routes
for (let route of Object.keys(routes)) {
  app.use('/' + route, routes[route]);
}

module.exports = app;

'use strict';

const app = require('express')();
const BodyParser = require('body-parser');
const cors = require('cors');
const Celebrate = require('celebrate');
const importDir = require('import-dir');
const routes = importDir('./routes');
const config = require('config');

// enable cross-origin requests
app.use(cors());
app.use(BodyParser.json());

// load api routes
for (let route of Object.keys(routes)) {
  app.use('/' + route, routes[route]);
}

// middleware to handle joi validation errors
app.use(Celebrate.errors());

// middleware to handle errors
app.use(function(err, req, res, next) {

  if (config.environment == 'production')
    return res.status(500).send();

  res.status(500).json({
    message: err.message
  });

});

module.exports = app;

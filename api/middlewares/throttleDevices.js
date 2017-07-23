'use strict';

const config = require('config');

/**
 * check if throttle feature is enabled and if the current request serial number is blocked
 */
module.exports = function(req, res, next) {

  if (!config.throttle)
    return next();

  if (config.throttledDevices.indexOf(req.device.deviceId) != -1)
    return res.status(403).send();

  next();
};

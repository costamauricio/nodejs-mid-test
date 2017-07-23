'use strict';

const router = require('express').Router();
const Joi = require('joi');
const Celebrate = require('celebrate');
const Device = require('db/models/device');
const Position = require('db/models/position');
const throttleDevicesMiddleware = require('api/middlewares/throttleDevices');

/**
 * POST positions/:deviceId
 *
 * we are using Joi with Celebrate middleware to validade request schema
 */
router.post('/:deviceId', Celebrate({
  body: Joi.array().items(
    Joi.object().keys({
      latitude: Joi.number().required(),
      longitude: Joi.number().required()
    })
  ).single()
}), function(req, res, next) {

  // middleware to check and retrieve the device information
  Device.findByDeviceId(req.params.deviceId)
    .then((data) => {
      if (!data)
        return res.status(404).send();

      req.device = data;
      next();
    })
    .catch(next);
}, throttleDevicesMiddleware, (req, res, next) => {

  if (!Array.isArray(req.body))
    req.body = [req.body];

  // add deviceSN information to the positions
  req.body = req.body.map((item) => {
    item.deviceSN = req.device.serialNumber;
    return item;
  });

  // save all positions
  Position.saveAll(req.body)
    .then(() => {
      res.status(200).send();
    })
    .catch(next);
});

module.exports = router;

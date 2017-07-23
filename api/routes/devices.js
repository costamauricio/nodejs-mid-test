'use strict';

const router = require('express').Router();
const Joi = require('joi');
const Celebrate = require('celebrate');
const Device = require('db/models/device');

/**
 * POST devices route
 *
 * we are using Joi with Celebrate middleware to validate the request schema
 */
router.post('/', Celebrate({
  body: Joi.array().items(
    Joi.object().keys({
      serialNumber: Joi.string().required(),
      deviceId: Joi.string().required(),
      name: Joi.string()
    })
  ).single()
}), function(req, res, next) {
  // middleware to check if there is already a device with any deviceId informed
  let deviceIds = Array.isArray(req.body) ? req.body.map((item) => item.deviceId) : [req.body.deviceId];

  // check if any of the deviceId iformed already exists
  Device.checkDeviceId(deviceIds)
    .then((data) => {
      if (!data.length)
        return next();

      res.status(400).json({
        message: 'DeviceId already exists.',
        deviceId: data
      });
    })
    .catch(next);
}, (req, res, next) => {

  // save all devices
  Device.saveAll(req.body)
    .then(() => {
      res.status(200).json();
    })
    .catch(next);
});

/**
 * GET devices route
 */
router.get('/', (req, res, next) => {

  // retrieve all devices
  Device.findAll()
    .then((devices) => {
      res.status(200).json(devices);
    })
    .catch(next);
});

/**
 * GET devices/:id route
 */
router.get('/:id', function(req, res, next) {

  // middleware to check and retrieve the device information
  Device.findById(req.params.id)
    .then((data) => {
      if (!data)
        return res.status(404).send();

      req.device = data;
      next();
    })
    .catch(next);
}, (req, res) => {
  res.status(200).json(req.device);
});

module.exports = router;

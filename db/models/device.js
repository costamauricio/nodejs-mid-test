'use strict';

const db = require('db');
const ObjectID = require('mongodb').ObjectID;

function standardDocument(item) {
  item.deviceId = item.deviceId || '';
  item.name = item.name || '';

  return item;
}

module.exports = {

  async findAll() {
    let data = await db.getCollection('devices').find({});

    if (!data.length)
      return null;

    return data.map(standardDocument);
  },

  async findById(id) {
    // verify if the id is a valid objectId
    if (!ObjectID.isValid(id))
      return null;

    let data = await db.getCollection('devices').findOne({ _id : id });

    if (!data)
      return null;

    return standardDocument(data);
  },

  async findByDeviceId(id) {
    let data = await db.getCollection('devices').findOne({ deviceId : id });

    if (!data)
      return null;

    return standardDocument(data);
  },

  async saveAll(devices) {
    return db.getCollection('devices').insert(devices);
  },

  /**
   * Check if any deviceId are already saved
   */
  async checkDeviceId(ids) {
    let data = await db.getCollection('devices').find({ deviceId: { $in: ids } }, { deviceId: 1 });

    if (!data)
      return [];

    return data.map((item) => item.deviceId);
  }
};

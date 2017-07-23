'use strict';

const db = require('db');

module.exports = {
  async saveAll(positions) {
    return db.getCollection('positions').insert(positions);
  }
};

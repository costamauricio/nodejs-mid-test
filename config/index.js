'use strict';

// global configs
module.exports = Object.freeze({
  environment: process.env.NODE_ENV || 'development',
  get throttle() {
    return process.env.THROTTLE_FEATURE || false;
  },
  get throttledDevices() {
    return (process.env.THROTTLED_DEVICES || '').split(',');
  },
  server: {
    host: '0.0.0.0',
    port: process.env.NODE_PORT || process.env.PORT
  },
  db: {
    host: process.env.MONGO_HOST,
    port: process.env.MONGO_PORT,
    name: process.env.MONGO_DB_NAME
  }
});

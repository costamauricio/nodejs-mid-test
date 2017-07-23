'use strict';

const monk = require('monk');

module.exports = {

  connection: null,

  /**
   * Get a database Collection reference
   */
  getCollection(collection) {
    return this.connection.get(collection);
  },

  /**
   * Connect with the database
   */
  connect(uri) {

    return new Promise((resolve, reject) => {
      monk(uri)
        .then((conn) => {

          this.connection = conn;

          // close mongodb connection
          process.on('SIGINT', () => {
            this.connection.close();
          });

          resolve();
        })
        .catch(reject);
    });
  }
};

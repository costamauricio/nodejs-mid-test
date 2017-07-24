process.env.MONGO_DB_NAME = 'api-test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();

const server = require('../index');
const db = require('db');

chai.use(chaiHttp);

describe('positions', () => {

  // Clear devices collection
  beforeEach((done) => {
    db.getCollection('devices').remove({}).then(() => { done() });
  });

  describe('POST /positions', () => {

    it('should include positions to a device', (done) => {
      let device = {
        serialNumber: '998aAIo3dd664',
        deviceId: '88923jdKSid8'
      };

      db.getCollection('devices').insert(Object.create(device)).then(() => {

        chai.request(server)
          .post('/positions/' + device.deviceId)
          .send({
            latitude: 13.4555,
            longitude: 34.9888
          })
          .end((err, res) => {
            res.should.have.status(200);
            done();
          });
      });
    });

    it('should not include a position', (done) => {

      chai.request(server)
        .post('/positions/339404503')
        .send({
          latitude: 13.4555,
          longitude: 34.9888
        })
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });
});

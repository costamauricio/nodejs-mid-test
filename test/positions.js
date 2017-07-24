process.env.MONGO_DB_NAME = 'api-test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const expect = chai.expect;

const server = require('../index');
const config = require('config');
const db = require('monk')(`${config.db.host}:${config.db.port}/${config.db.name}`);

chai.use(chaiHttp);

describe('positions endpoint', () => {

  // Clear devices and positions collection
  beforeEach((done) => {
    db.get('devices').remove({})
      .then(() => {
        db.get('positions').remove({})
          .then(() => {
            done();
          });
      });
  });

  describe('POST /positions', () => {

    describe('Throttle feature disabled', () => {

      before(() => {
        process.env.THROTTLE_FEATURE = false;
      });

      it('should POST to /positions and include positions to a device', (done) => {
        let device = {
          serialNumber: '998aAIo3dd664',
          deviceId: '88923jdKSid8'
        };

        let position = {
          latitude: 13.4555,
          longitude: 34.9888
        };

        db.get('devices').insert(Object.create(device)).then(() => {

          chai.request(server)
            .post('/positions/' + device.deviceId)
            .send(position)
            .end((err, res) => {
              res.should.have.status(200);

              db.get('positions').find()
                .then((data) => {

                  expect(data).to.be.a('array');
                  expect(data.length).to.be.eql(1);
                  expect(data[0]).to.include(position);
                  expect(data[0]).to.have.property('deviceSN');
                  expect(data[0].deviceSN).to.be.eql(device.serialNumber);
                  done();
                });
            });
        });
      });

      it('should POST to /positions and return status code 404', (done) => {

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

    describe('Throttle feature enabled', () => {

      before(() => {
        process.env.THROTTLE_FEATURE = true;
        process.env.THROTTLED_DEVICES = '7736bdu856';
      });

      it('should POST to /devices and return status code 403', (done) => {

        let device = {
          serialNumber: '998aAIo3dd664',
          deviceId: '7736bdu856'
        };

        let position = {
          latitude: 13.4555,
          longitude: 34.9888
        };

        db.get('devices').insert(device).then(() => {

          chai.request(server)
            .post('/positions/' + device.deviceId)
            .send(position)
            .end((err, res) => {
              res.should.have.status(403);
              done();
            });
        });
      });

      it('should POST to /devices and include positions to a device', (done) => {

        let device = {
          serialNumber: 'hhstgrbif8969',
          deviceId: '8734hdisd98',
          name: 'Device Test'
        };

        let position = {
          latitude: 598.546,
          longitude: 4446.989
        };

        db.get('devices').insert(device).then(() => {

          chai.request(server)
            .post('/positions/' + device.deviceId)
            .send(position)
            .end((err, res) => {
              res.should.have.status(200);
              
              db.get('positions').find()
                .then((data) => {

                  expect(data).to.be.a('array');
                  expect(data.length).to.be.eql(1);
                  expect(data[0]).to.include(position);
                  expect(data[0]).to.have.property('deviceSN');
                  expect(data[0].deviceSN).to.be.eql(device.serialNumber);
                  done();
                });
            });
        });
      });
    });
  });

});

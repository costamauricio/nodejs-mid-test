process.env.MONGO_DB_NAME = 'api-test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();

const server = require('../index');
const db = require('db');

chai.use(chaiHttp);

describe('devices', () => {

  // Clear devices collection
  beforeEach((done) => {
    db.getCollection('devices').remove({}).then(() => { done() });
  });

  describe('GET /devices', () => {

    it('should GET all devices', (done) => {

      let devices = [
        {
          serialNumber: '998aAIo3dd664',
          deviceId: '88923jdKSid8',
          name: 'First device'
        },
        {
          serialNumber: 'iisHSuetw0-98',
          deviceId: 'j998#538d39'
        }
      ];

      db.getCollection('devices').insert(devices).then(() => {

        chai.request(server)
          .get('/devices')
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body.length.should.be.eql(2);
            res.body[0].should.have.property('_id');
            res.body[1].should.have.property('_id');
            res.body[1].should.have.property('name');
            res.body[1].name.should.be.eql('');

            done();
          });
      });
    });

    it('shoud GET a specific device', (done) => {

      let device = {
        serialNumber: '998aAIo3dd664',
        deviceId: '88923jdKSid8',
        name: 'First device'
      };

      db.getCollection('devices').insert(device).then(() => {

        chai.request(server)
          .get('/devices/' + device._id)
          .end((err, res) => {

            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('_id');
            res.body.should.have.property('serialNumber');
            res.body.should.have.property('deviceId');
            res.body.should.have.property('name');
            res.body._id.should.be.deep.eql(String(device._id));

            done();
          });
      });
    });

    it('should not found a device', (done) => {

      chai.request(server)
        .get('/devices/109838339201')
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });

    it('should include a device', (done) => {
      let device = {
        serialNumber: '998aAIo3dd664',
        deviceId: '88923jdKSid8',
        name: 'First device'
      };

      chai.request(server)
        .post('/devices')
        .send(device)
        .end((err, res) => {

          res.should.have.status(200);

          chai.request(server)
            .get('/devices')
            .end((err, res) => {

              res.should.have.status(200);
              res.body.should.be.a('array');
              res.body.length.should.be.eql(1);
              done();
            });
        });
    });

    it('should not include the device', (done) => {
      let device = {
        serialNumber: '998aAIo3dd664',
        deviceId: '88923jdKSid8',
        name: 'First device'
      };

      db.getCollection('devices').insert(Object.create(device)).then(() => {

        chai.request(server)
          .post('/devices')
          .send(device)
          .end((err, res) => {
            
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('deviceId');
            done();
          });
      });
    });
  });
});

process.env.MONGO_DB_NAME = 'api-test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const expect = chai.expect;

const server = require('../index');
const config = require('config');
const db = require('monk')(`${config.db.host}:${config.db.port}/${config.db.name}`);

chai.use(chaiHttp);

describe('devices endpoint', () => {

  // Clear devices collection
  beforeEach((done) => {
    db.get('devices').remove({}).then(() => { done() });
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

      db.get('devices').insert(devices).then(() => {

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

      db.get('devices').insert(device).then(() => {

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

    it('should GET and return status code 404', (done) => {

      chai.request(server)
        .get('/devices/109838339201')
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });

  });

  describe('POST /devices', () => {

    it('should POST to /devices and include a device', (done) => {
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

          db.get('devices').find().then((data) => {

            expect(data).to.be.a('array');
            expect(data.length).to.be.eql(1);
            expect(data[0]).to.include(device);

            done();
          });
        });
    });

    it('should POST to /devices and return status code 400 with invalid deviceId', (done) => {
      let device = {
        serialNumber: '998aAIo3dd664',
        deviceId: '88923jdKSid8',
        name: 'First device'
      };

      db.get('devices').insert(Object.create(device)).then(() => {

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

    it('should POST to /devices and return status code 400 with invalid schema', (done) => {

      let device = {
        deviceId: '88923jdKSid8',
        name: 'First device'
      };

      chai.request(server)
        .post('/devices')
        .send(device)
        .end((err, res) => {

          res.should.have.status(400);
          res.body.should.be.a('object');
          done();
        });
    });
  });
});

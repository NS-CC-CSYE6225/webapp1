const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../main'); 

chai.use(chaiHttp);
const expect = chai.expect;

describe('Health Check Endpoint', () => {
  it('should return status 200', (done) => {
    chai.request(app)
      .get('/healthz')
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });
});